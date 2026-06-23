/**
 * WooCommerce Store API client (`/wp-json/wc/store/v1`).
 *
 * The Store API is the PUBLIC, customer-facing commerce API — distinct from the
 * authenticated wc/v3 admin API used by `client.ts` for the catalog. It powers
 * the on-site cart and checkout: no consumer key/secret, session state is carried
 * by a per-shopper Cart-Token instead.
 *
 * These calls run server-side from our Next.js route handlers (see
 * `src/app/api/shop/*`). The browser never talks to WooCommerce directly, which
 * keeps the store origin out of the client bundle and lets us add validation,
 * rate-context, and error normalization at our own boundary.
 *
 * ── Session model (per WooCommerce Store API docs) ────────────────────────────
 *  • Cart-Token (JWT): returned in the `Cart-Token` RESPONSE header on the first
 *    cart call. Echo it back in the `Cart-Token` REQUEST header on every
 *    subsequent call to address the SAME cart. This is the session handle we
 *    persist on the client (see CartContext) and forward through our proxy.
 *  • Nonce: WooCommerce also issues a `Nonce` response header. For cross-origin /
 *    headless setups Woo can be configured to accept the Cart-Token alone, but
 *    some installs still require the Nonce on mutating (cart write / checkout)
 *    requests. We capture and forward it when present.  [ASSUMPTION — verify
 *    against the live store: whether Nonce is required depends on the store's
 *    CORS / "Store API authentication" configuration. The client forwards both
 *    tokens so either configuration works.]
 *
 * ── What is NOT verifiable without a live store ───────────────────────────────
 *  There is no running WooCommerce instance to test against. Endpoint shapes,
 *  header names, and the checkout payload below follow the published Store API
 *  contract (Woo Blocks `src/StoreApi`). Anything marked ASSUMPTION should be
 *  confirmed once a real store exists.
 */

import { getWooCommerceConfig } from "@/lib/integrations/woocommerce/config";

const STORE_API_BASE = "/wp-json/wc/store/v1";

/** Header WooCommerce uses to read/write the per-shopper cart session. */
export const CART_TOKEN_HEADER = "Cart-Token";
/** Header WooCommerce uses for the cart/checkout nonce (when required). */
export const CART_NONCE_HEADER = "Nonce";

/** Session tokens that identify a single shopper's cart across requests. */
export type StoreApiSession = {
  cartToken?: string;
  nonce?: string;
};

/** A line item inside the Store API cart response (subset we render). */
export type StoreCartItem = {
  key: string;
  id: number;
  quantity: number;
  name: string;
  /** Decimal-string permalink-friendly slug, when present. */
  slug?: string;
  images: { src: string; alt: string }[];
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_minor_unit: number;
    currency_symbol: string;
  };
  totals: {
    line_total: string;
    line_subtotal: string;
    currency_code: string;
    currency_minor_unit: number;
  };
};

/** The Store API cart response (subset we render). */
export type StoreCart = {
  items: StoreCartItem[];
  items_count: number;
  needs_payment: boolean;
  needs_shipping: boolean;
  totals: {
    total_items: string;
    total_price: string;
    total_tax: string;
    currency_code: string;
    currency_minor_unit: number;
    currency_symbol: string;
  };
};

/** Cart plus the (possibly refreshed) session tokens from the same response. */
export type StoreCartResult = {
  cart: StoreCart;
  session: StoreApiSession;
};

/** Address block accepted by the checkout endpoint. */
export type CheckoutAddress = {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

/** Payload posted to the Store API checkout endpoint. */
export type CheckoutRequest = {
  billing_address: CheckoutAddress;
  shipping_address?: CheckoutAddress;
  /** Gateway id, e.g. "stripe" for the WooCommerce Stripe gateway. */
  payment_method: string;
  /**
   * Gateway-specific fields. For the WooCommerce Stripe gateway this carries the
   * Stripe PaymentMethod id created by Stripe.js on the client, e.g.
   * `[{ key: "stripe_source", value: "pm_..." }]` or
   * `[{ key: "payment_method_id", value: "pm_..." }]`.
   * [ASSUMPTION — the exact key depends on the installed Stripe gateway plugin
   * (official "WooCommerce Stripe" vs "Stripe for WooCommerce"). Confirm the key
   * against the live gateway; the structure (array of {key,value}) is fixed by
   * the Store API contract.]
   */
  payment_data: { key: string; value: string }[];
  customer_note?: string;
};

/** The Store API checkout response (subset we act on). */
export type CheckoutResult = {
  order_id: number;
  status: string;
  order_key: string;
  payment_result: {
    payment_status: string;
    /** Present when the gateway needs an extra client step (e.g. 3-D Secure). */
    redirect_url?: string;
    payment_details: { key: string; value: string }[];
  };
};

export type StoreApiError = {
  ok: false;
  /** HTTP status, or 0 for a transport/config failure. */
  status: number;
  /** WooCommerce error code, when the body provided one. */
  code?: string;
  message: string;
};

export type StoreApiSuccess<T> = { ok: true; data: T; session: StoreApiSession };

export type StoreApiResponse<T> = StoreApiSuccess<T> | StoreApiError;

/** True when the storefront has enough config to talk to WooCommerce at all. */
export function isStoreApiConfigured(): boolean {
  return getWooCommerceConfig() !== null;
}

function readSessionFromResponse(res: Response): StoreApiSession {
  const cartToken = res.headers.get(CART_TOKEN_HEADER) ?? undefined;
  const nonce = res.headers.get(CART_NONCE_HEADER) ?? undefined;
  return { cartToken, nonce };
}

/**
 * Core request wrapper. Builds the Store API URL from the configured Woo host,
 * forwards the session tokens, and normalizes every outcome into a discriminated
 * `StoreApiResponse` so callers never have to try/catch. Returns a config error
 * (status 0) when WooCommerce is unconfigured rather than throwing.
 */
async function storeApiRequest<T>(
  path: string,
  init: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    session?: StoreApiSession;
  } = {}
): Promise<StoreApiResponse<T>> {
  const config = getWooCommerceConfig();
  if (!config) {
    return {
      ok: false,
      status: 0,
      code: "store_not_configured",
      message: "The shop is not configured yet.",
    };
  }

  const url = `${config.apiBaseUrl}${STORE_API_BASE}${path}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";
  if (init.session?.cartToken) headers[CART_TOKEN_HEADER] = init.session.cartToken;
  if (init.session?.nonce) headers[CART_NONCE_HEADER] = init.session.nonce;

  let res: Response;
  try {
    res = await fetch(url, {
      method: init.method ?? "GET",
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      // Cart/checkout state is per-request and must never be cached.
      cache: "no-store",
    });
  } catch (error) {
    // Transport failure (DNS, TLS, network). Surface — never pretend success.
    console.warn(
      `[woocommerce-store] request to ${path} failed:`,
      error instanceof Error ? error.message : error
    );
    return {
      ok: false,
      status: 0,
      code: "store_unreachable",
      message: "Could not reach the shop. Please try again.",
    };
  }

  const session = readSessionFromResponse(res);

  let payload: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      // Non-JSON body (HTML error page, gateway interstitial). Treat as failure.
      return {
        ok: false,
        status: res.status,
        message: `Unexpected response from the shop (${res.status}).`,
      };
    }
  }

  if (!res.ok) {
    const errorBody =
      typeof payload === "object" && payload !== null
        ? (payload as { code?: string; message?: string })
        : {};
    return {
      ok: false,
      status: res.status,
      code: errorBody.code,
      // Woo error messages can contain HTML; the UI renders them as plain text.
      message: errorBody.message ?? `Shop error (${res.status}).`,
    };
  }

  return { ok: true, data: payload as T, session };
}

/** Fetch the current cart for a session (creates an anonymous cart if none). */
export function getCart(
  session?: StoreApiSession
): Promise<StoreApiResponse<StoreCart>> {
  return storeApiRequest<StoreCart>("/cart", { session });
}

/**
 * Add a product to the cart. `id` is the WooCommerce product id; `quantity`
 * defaults to 1. The response carries the full updated cart and a refreshed
 * session (capture it and reuse it on the next call).
 */
export function addCartItem(
  params: { id: number; quantity?: number },
  session?: StoreApiSession
): Promise<StoreApiResponse<StoreCart>> {
  return storeApiRequest<StoreCart>("/cart/add-item", {
    method: "POST",
    body: { id: params.id, quantity: params.quantity ?? 1 },
    session,
  });
}

/** Set the absolute quantity for a cart line by its `key`. */
export function updateCartItem(
  params: { key: string; quantity: number },
  session?: StoreApiSession
): Promise<StoreApiResponse<StoreCart>> {
  return storeApiRequest<StoreCart>("/cart/update-item", {
    method: "POST",
    body: { key: params.key, quantity: params.quantity },
    session,
  });
}

/** Remove a cart line by its `key`. */
export function removeCartItem(
  params: { key: string },
  session?: StoreApiSession
): Promise<StoreApiResponse<StoreCart>> {
  return storeApiRequest<StoreCart>("/cart/remove-item", {
    method: "POST",
    body: { key: params.key },
    session,
  });
}

/**
 * Place the order. The WooCommerce Stripe gateway processes the charge using the
 * Stripe PaymentMethod id carried in `payment_data`. A `redirect_url` in the
 * result means the gateway needs an additional client step (e.g. 3-D Secure).
 */
export function submitCheckout(
  request: CheckoutRequest,
  session?: StoreApiSession
): Promise<StoreApiResponse<CheckoutResult>> {
  return storeApiRequest<CheckoutResult>("/checkout", {
    method: "POST",
    body: request,
    session,
  });
}
