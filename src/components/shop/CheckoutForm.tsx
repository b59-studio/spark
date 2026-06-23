"use client";

/**
 * On-site checkout form.
 *
 * Flow:
 *  1. Collect contact + billing details (validated here and again server-side).
 *  2. Tokenize the card via the isolated StripePaymentSection → PaymentMethod id.
 *  3. POST contact + PaymentMethod id + cart session to /api/shop/checkout, which
 *     forwards the order to WooCommerce; the Woo Stripe gateway charges the card.
 *  4. On success, show an order confirmation. If the gateway returns a redirect
 *     (e.g. 3-D Secure), send the customer there to complete authentication.
 *
 * No card data or PaymentMethod id is ever logged. The form is inert when the
 * shop is unconfigured (the cart context reports "unconfigured").
 */

import { useRef, useState } from "react";
import { useCart } from "@/components/shop/CartContext";
import CartView from "@/components/shop/CartView";
import StripePaymentSection, {
  type StripePaymentHandle,
} from "@/components/shop/StripePaymentSection";

type ContactFields = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

const EMPTY_FIELDS: ContactFields = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "US",
};

type OrderConfirmation = {
  id: number;
  status: string;
  redirectUrl?: string;
};

export default function CheckoutForm() {
  const { cart, status, session } = useCart();
  const paymentRef = useRef<StripePaymentHandle>(null);

  const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(
    null
  );

  const cartEmpty = !cart || cart.items.length === 0;

  function update<K extends keyof ContactFields>(key: K, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    setSubmitting(true);
    setError(null);

    try {
      // Tokenize the card. The payment section returns a null id (with a clear
      // message) when Stripe isn't configured or the card is invalid.
      const payment = await paymentRef.current?.createPaymentMethod({
        name: `${fields.first_name} ${fields.last_name}`.trim(),
        email: fields.email,
        phone: fields.phone || undefined,
        address: {
          line1: fields.address_1,
          line2: fields.address_2 || undefined,
          city: fields.city,
          state: fields.state,
          postal_code: fields.postcode,
          country: fields.country,
        },
      });

      if (!payment || !payment.paymentMethodId) {
        setError(
          payment?.error ??
            "Add your card details to place the order."
        );
        setSubmitting(false);
        return;
      }

      const billing = {
        first_name: fields.first_name,
        last_name: fields.last_name,
        email: fields.email,
        phone: fields.phone || undefined,
        address_1: fields.address_1,
        address_2: fields.address_2 || undefined,
        city: fields.city,
        state: fields.state,
        postcode: fields.postcode,
        country: fields.country,
      };

      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billing,
          paymentMethodId: payment.paymentMethodId,
          session,
        }),
      });

      const data = (await res.json()) as {
        configured?: boolean;
        order?: OrderConfirmation;
        error?: string;
      };

      if (data.configured === false) {
        setError("The shop is not available right now.");
        setSubmitting(false);
        return;
      }
      if (!res.ok || !data.order) {
        setError(data.error ?? "We couldn't place your order. Please try again.");
        setSubmitting(false);
        return;
      }

      // Gateway needs an extra client step (e.g. 3-D Secure) → hand off.
      if (data.order.redirectUrl) {
        window.location.href = data.order.redirectUrl;
        return;
      }

      setConfirmation(data.order);
      setSubmitting(false);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  if (status === "unconfigured") {
    return (
      <div className="spark-panel spark-framed rounded-2xl p-8 text-center">
        <p className="body-md">Checkout is coming soon. Check back shortly.</p>
      </div>
    );
  }

  if (confirmation) {
    return (
      <div className="spark-panel spark-framed rounded-2xl p-8 text-center">
        <h2 className="heading-lg mb-4">Thank you for your order</h2>
        <p className="body-md">
          Order #{confirmation.id} is {confirmation.status}. A confirmation email
          is on its way.
        </p>
      </div>
    );
  }

  if (cartEmpty) {
    return <CartView showCheckoutLink={false} />;
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <fieldset className="space-y-4">
          <legend className="heading-md mb-2">Contact</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="First name"
              name="first_name"
              autoComplete="given-name"
              value={fields.first_name}
              onChange={(v) => update("first_name", v)}
              required
            />
            <Field
              label="Last name"
              name="last_name"
              autoComplete="family-name"
              value={fields.last_name}
              onChange={(v) => update("last_name", v)}
              required
            />
          </div>
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={(v) => update("email", v)}
            required
          />
          <Field
            label="Phone (optional)"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={fields.phone}
            onChange={(v) => update("phone", v)}
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="heading-md mb-2">Billing address</legend>
          <Field
            label="Street address"
            name="address_1"
            autoComplete="address-line1"
            value={fields.address_1}
            onChange={(v) => update("address_1", v)}
            required
          />
          <Field
            label="Apartment, suite, etc. (optional)"
            name="address_2"
            autoComplete="address-line2"
            value={fields.address_2}
            onChange={(v) => update("address_2", v)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="City"
              name="city"
              autoComplete="address-level2"
              value={fields.city}
              onChange={(v) => update("city", v)}
              required
            />
            <Field
              label="State / Province"
              name="state"
              autoComplete="address-level1"
              value={fields.state}
              onChange={(v) => update("state", v)}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Postal code"
              name="postcode"
              autoComplete="postal-code"
              value={fields.postcode}
              onChange={(v) => update("postcode", v)}
              required
            />
            <Field
              label="Country"
              name="country"
              autoComplete="country"
              value={fields.country}
              onChange={(v) => update("country", v)}
              required
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="heading-md mb-2">Payment</legend>
          <StripePaymentSection ref={paymentRef} />
        </fieldset>

        {error ? (
          <p className="callout-alert body-sm" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full disabled:opacity-60"
        >
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </form>

      <aside className="lg:sticky lg:top-28">
        <h2 className="heading-md mb-4">Order summary</h2>
        <CartView showCheckoutLink={false} />
      </aside>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  autoComplete,
  required = false,
}: FieldProps) {
  return (
    <div>
      <label className="form-label mb-1 block" htmlFor={`checkout-${name}`}>
        {label}
      </label>
      <input
        id={`checkout-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input w-full"
      />
    </div>
  );
}
