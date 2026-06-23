"use client";

/**
 * Minimal Stripe.js loader for the on-site checkout.
 *
 * ── Why a hosted-script loader instead of importing @stripe/stripe-js ─────────
 * The Stripe SDK packages (`@stripe/stripe-js`, `@stripe/react-stripe-js`) are
 * owned by a separate workstream and are NOT yet in package.json. To keep the
 * build green today while remaining the genuine Stripe.js runtime, this loads the
 * official hosted script (https://js.stripe.com/v3) and reads the global `Stripe`
 * constructor — exactly what `@stripe/stripe-js`'s `loadStripe()` does internally.
 *
 * ── Migration once @stripe/stripe-js is installed ─────────────────────────────
 * Replace the body of `getStripe()` with:
 *
 *     import { loadStripe } from "@stripe/stripe-js";
 *     stripePromise ??= loadStripe(config.publishableKey);
 *     return stripePromise;
 *
 * and prefer `@stripe/react-stripe-js` (<Elements>, <PaymentElement>) for the
 * card UI in StripePaymentSection. The PaymentMethod-id flow below stays the same.
 *
 * PCI note: card fields render inside Stripe's iframe; raw card data never touches
 * our DOM, our server, or our logs.
 */

import { getStripeBrowserConfig } from "@/lib/integrations/stripe/config";

const STRIPE_JS_SRC = "https://js.stripe.com/v3";

/**
 * The slice of the Stripe.js API this checkout uses. Intentionally narrow — when
 * `@stripe/stripe-js` is added, its richer `Stripe` type supersedes this.
 */
export type StripeLike = {
  elements: (options?: unknown) => StripeElementsLike;
  createPaymentMethod: (params: {
    type: "card";
    card: unknown;
    billing_details?: Record<string, unknown>;
  }) => Promise<{
    paymentMethod?: { id: string };
    error?: { message?: string };
  }>;
};

export type StripeElementsLike = {
  create: (type: string, options?: unknown) => StripeElementLike;
  getElement: (type: string) => StripeElementLike | null;
};

export type StripeElementLike = {
  mount: (selector: string | HTMLElement) => void;
  unmount: () => void;
  on: (event: string, handler: (event: unknown) => void) => void;
  destroy: () => void;
};

type StripeConstructor = (publishableKey: string) => StripeLike;

declare global {
  interface Window {
    Stripe?: StripeConstructor;
  }
}

let stripePromise: Promise<StripeLike | null> | null = null;

function injectStripeScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Stripe.js can only load in the browser."));
      return;
    }
    if (window.Stripe) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="${STRIPE_JS_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Stripe.js failed to load."))
      );
      return;
    }
    const script = document.createElement("script");
    script.src = STRIPE_JS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Stripe.js failed to load."));
    document.head.appendChild(script);
  });
}

/**
 * Resolve a Stripe instance, or null when Stripe is unconfigured / fails to load.
 * Memoized so the script loads at most once per page.
 */
export function getStripe(): Promise<StripeLike | null> {
  if (stripePromise) return stripePromise;

  const config = getStripeBrowserConfig();
  if (!config) {
    stripePromise = Promise.resolve(null);
    return stripePromise;
  }

  stripePromise = injectStripeScript()
    .then(() => {
      if (!window.Stripe) return null;
      return window.Stripe(config.publishableKey);
    })
    .catch((error) => {
      console.warn(
        "[stripe] failed to initialize:",
        error instanceof Error ? error.message : error
      );
      return null;
    });

  return stripePromise;
}
