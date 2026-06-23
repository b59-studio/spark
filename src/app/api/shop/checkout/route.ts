/**
 * On-site checkout proxy for the WooCommerce Store API.
 *
 * Validates the customer's contact + billing details at the boundary, then posts
 * the order to WooCommerce. The actual charge is handled by the WooCommerce
 * Stripe gateway: the client creates a Stripe PaymentMethod with Stripe.js and
 * passes its id here as `paymentMethodId`; we hand it to Woo in `payment_data`.
 *
 * No card data ever touches this server — only the Stripe PaymentMethod id (a
 * tokenized reference). We never log it or the customer's PII.
 *
 * No-ops gracefully when WooCommerce is unconfigured (HTTP 200, configured:false).
 */

import { NextResponse } from "next/server";
import {
  isStoreApiConfigured,
  submitCheckout,
  type CheckoutAddress,
  type CheckoutRequest,
  type StoreApiSession,
} from "@/lib/integrations/woocommerce/store-client";

/**
 * Payment-data key the WooCommerce Stripe gateway expects for a pre-created
 * PaymentMethod. [ASSUMPTION — the official "WooCommerce Stripe Payment Gateway"
 * reads the PaymentMethod id from this key on Store API checkout. The exact key
 * varies between gateway plugins/versions; confirm against the live gateway and
 * change here if needed.]
 */
const STRIPE_PAYMENT_METHOD_KEY = "payment_method_id";
/** Gateway id registered by the WooCommerce Stripe plugin. */
const STRIPE_GATEWAY_ID = "stripe";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RawAddress = Record<string, unknown>;

type CheckoutBody = {
  billing?: unknown;
  shipping?: unknown;
  paymentMethodId?: unknown;
  paymentMethod?: unknown;
  customerNote?: unknown;
  session?: unknown;
};

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseSession(value: unknown): StoreApiSession | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const v = value as { cartToken?: unknown; nonce?: unknown };
  const cartToken = typeof v.cartToken === "string" ? v.cartToken : undefined;
  const nonce = typeof v.nonce === "string" ? v.nonce : undefined;
  if (!cartToken && !nonce) return undefined;
  return { cartToken, nonce };
}

/**
 * Validate and normalize a billing address. Returns the typed address or a list
 * of field-level errors. Email is required on billing (Woo uses it as the order
 * contact and the analytics key); shipping email is optional.
 */
function parseAddress(
  raw: unknown,
  { requireEmail }: { requireEmail: boolean }
): { address: CheckoutAddress } | { errors: string[] } {
  if (typeof raw !== "object" || raw === null) {
    return { errors: ["Address is missing."] };
  }
  const a = raw as RawAddress;
  const errors: string[] = [];

  const firstName = str(a.first_name);
  const lastName = str(a.last_name);
  const address1 = str(a.address_1);
  const city = str(a.city);
  const state = str(a.state);
  const postcode = str(a.postcode);
  const country = str(a.country);
  const email = str(a.email);
  const phone = str(a.phone);

  if (!firstName) errors.push("First name is required.");
  if (!lastName) errors.push("Last name is required.");
  if (!address1) errors.push("Street address is required.");
  if (!city) errors.push("City is required.");
  if (!state) errors.push("State is required.");
  if (!postcode) errors.push("Postal code is required.");
  if (!country) errors.push("Country is required.");
  if (requireEmail) {
    if (!email) errors.push("Email is required.");
    else if (!EMAIL_PATTERN.test(email)) errors.push("Enter a valid email.");
  }

  if (errors.length > 0) return { errors };

  const address: CheckoutAddress = {
    first_name: firstName,
    last_name: lastName,
    address_1: address1,
    address_2: str(a.address_2) || undefined,
    city,
    state,
    postcode,
    country,
    email: email || undefined,
    phone: phone || undefined,
  };
  return { address };
}

export async function POST(req: Request) {
  if (!isStoreApiConfigured()) {
    return NextResponse.json({ configured: false });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const {
    billing,
    shipping,
    paymentMethodId,
    paymentMethod,
    customerNote,
    session,
  } = body as CheckoutBody;

  const billingResult = parseAddress(billing, { requireEmail: true });
  if ("errors" in billingResult) {
    return NextResponse.json(
      { error: billingResult.errors.join(" "), fieldErrors: billingResult.errors },
      { status: 400 }
    );
  }

  // Shipping is optional; when present it must validate (email not required).
  let shippingAddress: CheckoutAddress | undefined;
  if (shipping !== undefined && shipping !== null) {
    const shippingResult = parseAddress(shipping, { requireEmail: false });
    if ("errors" in shippingResult) {
      return NextResponse.json(
        { error: shippingResult.errors.join(" "), fieldErrors: shippingResult.errors },
        { status: 400 }
      );
    }
    shippingAddress = shippingResult.address;
  }

  const gatewayId = str(paymentMethod) || STRIPE_GATEWAY_ID;
  const stripePaymentMethodId = str(paymentMethodId);

  // The Stripe gateway needs a tokenized PaymentMethod id to charge the card.
  // Without it WooCommerce would reject the order, so fail fast with a clear
  // message rather than posting an unpayable order.
  const paymentData =
    gatewayId === STRIPE_GATEWAY_ID
      ? stripePaymentMethodId
        ? [{ key: STRIPE_PAYMENT_METHOD_KEY, value: stripePaymentMethodId }]
        : null
      : [];

  if (paymentData === null) {
    return NextResponse.json(
      { error: "Payment details are required to place the order." },
      { status: 400 }
    );
  }

  const checkoutRequest: CheckoutRequest = {
    billing_address: billingResult.address,
    shipping_address: shippingAddress,
    payment_method: gatewayId,
    payment_data: paymentData,
    customer_note: str(customerNote) || undefined,
  };

  const result = await submitCheckout(checkoutRequest, parseSession(session));

  if (!result.ok) {
    const status = result.status === 0 ? 503 : result.status;
    return NextResponse.json(
      { error: result.message, code: result.code },
      { status }
    );
  }

  // Return only what the client needs to confirm or complete (e.g. 3-D Secure).
  return NextResponse.json({
    configured: true,
    order: {
      id: result.data.order_id,
      status: result.data.status,
      orderKey: result.data.order_key,
      paymentStatus: result.data.payment_result?.payment_status,
      redirectUrl: result.data.payment_result?.redirect_url,
    },
  });
}
