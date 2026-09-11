"use client";

/**
 * Isolated Stripe payment step for the checkout.
 *
 * Responsibilities are deliberately narrow: mount Stripe's Card Element (card
 * data lives in Stripe's iframe, never our DOM) and, on request, tokenize it into
 * a PaymentMethod id. The id is the only payment value that leaves this component
 * — it is handed to the checkout API, which passes it to the WooCommerce Stripe
 * gateway to perform the charge.
 *
 * Degrades gracefully: when Stripe is unconfigured (no publishable key) or fails
 * to load, it renders a clear notice and reports "not ready" so the parent form
 * can disable the place-order button. The whole payment concern is contained here
 * so swapping in `@stripe/react-stripe-js` (<Elements>/<PaymentElement>) later
 * touches only this file.
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { getStripeBrowserConfig } from "@/lib/integrations/stripe/config";
import {
  getStripe,
  type StripeElementLike,
  type StripeElementsLike,
  type StripeLike,
} from "@/lib/integrations/stripe/load-stripe";

/** Billing details forwarded to Stripe when tokenizing the card. */
export type PaymentBillingDetails = {
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
};

/** Imperative handle the checkout form uses to create the PaymentMethod. */
export type StripePaymentHandle = {
  /** True once Stripe.js and the card element are mounted and usable. */
  isReady: () => boolean;
  /**
   * Tokenize the entered card into a PaymentMethod id, or return an error
   * message. Returns null id (with a message) when Stripe is unavailable.
   */
  createPaymentMethod: (
    billingDetails?: PaymentBillingDetails
  ) => Promise<{ paymentMethodId: string | null; error?: string }>;
};

const CARD_ELEMENT_MOUNT_ID = "spark-stripe-card-element";

const StripePaymentSection = forwardRef<StripePaymentHandle, object>(
  function StripePaymentSection(_props, ref) {
    const configured = getStripeBrowserConfig() !== null;
    const [ready, setReady] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [cardError, setCardError] = useState<string | null>(null);

    const stripeRef = useRef<StripeLike | null>(null);
    const elementsRef = useRef<StripeElementsLike | null>(null);
    const cardRef = useRef<StripeElementLike | null>(null);

    useEffect(() => {
      if (!configured) return;
      let cancelled = false;

      getStripe().then((stripe) => {
        if (cancelled) return;
        if (!stripe) {
          setLoadError("Payment is temporarily unavailable.");
          return;
        }
        stripeRef.current = stripe;
        const elements = stripe.elements();
        elementsRef.current = elements;
        const card = elements.create("card", {
          // Match the form-input palette so the card field looks native.
          style: {
            base: {
              color: "#f4dcb6",
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: "16px",
              "::placeholder": { color: "#a68f6a" },
            },
            invalid: { color: "#f4541f" },
          },
        });
        card.on("change", (event: unknown) => {
          const e = event as { error?: { message?: string } };
          setCardError(e.error?.message ?? null);
        });
        const mountEl = document.getElementById(CARD_ELEMENT_MOUNT_ID);
        if (mountEl) {
          card.mount(mountEl);
          cardRef.current = card;
          setReady(true);
        }
      });

      return () => {
        cancelled = true;
        cardRef.current?.destroy();
        cardRef.current = null;
      };
    }, [configured]);

    useImperativeHandle(
      ref,
      () => ({
        isReady: () => ready,
        createPaymentMethod: async (billingDetails) => {
          const stripe = stripeRef.current;
          const card = cardRef.current;
          if (!stripe || !card) {
            return {
              paymentMethodId: null,
              error: "Payment is not ready yet.",
            };
          }
          const result = await stripe.createPaymentMethod({
            type: "card",
            card,
            billing_details: billingDetails as Record<string, unknown>,
          });
          if (result.error || !result.paymentMethod) {
            return {
              paymentMethodId: null,
              error: result.error?.message ?? "Could not process the card.",
            };
          }
          return { paymentMethodId: result.paymentMethod.id };
        },
      }),
      [ready]
    );

    if (!configured) {
      return (
        <div className="callout-blue" role="note">
          <p className="body-sm">
            Online payment isn&apos;t set up yet. Once the store&apos;s Stripe
            key is configured, card payment will appear here.
          </p>
        </div>
      );
    }

    return (
      <div>
        <label className="form-label mb-2 block" htmlFor={CARD_ELEMENT_MOUNT_ID}>
          Card details
        </label>
        {/* Stripe mounts its secure card iframe into this container. */}
        <div
          id={CARD_ELEMENT_MOUNT_ID}
          className="form-input flex min-h-[2.75rem] items-center"
        />
        {loadError ? (
          <p className="body-sm text-spark-red mt-2" role="alert">
            {loadError}
          </p>
        ) : null}
        {cardError ? (
          <p className="body-sm text-spark-red mt-2" role="alert">
            {cardError}
          </p>
        ) : null}
      </div>
    );
  }
);

export default StripePaymentSection;
