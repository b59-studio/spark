/** Pinned Stripe API version. Keep in sync with the installed SDK default. */
export const STRIPE_API_VERSION = "2026-05-27.dahlia" as const;

export type StripeConfig = {
  /** Server-side secret key (sk_test_… / sk_live_…). Never exposed to the client. */
  secretKey: string;
  /** Publishable key (pk_test_… / pk_live_…) safe to send to the browser. */
  publishableKey: string;
  /** Stripe API version pinned for predictable behavior across SDK upgrades. */
  apiVersion: typeof STRIPE_API_VERSION;
};

/**
 * Server-side Stripe configuration. Returns null when keys are absent so the
 * donation flow no-ops gracefully (build/run succeed without secrets).
 */
export function getStripeConfig(): StripeConfig | null {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();

  if (!secretKey || !publishableKey) return null;

  return { secretKey, publishableKey, apiVersion: STRIPE_API_VERSION };
}

/**
 * Publishable key for client components. Safe to read in the browser; returns
 * null when unset so the donation form can render a "coming soon" state.
 */
export function getStripePublishableKey(): string | null {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || null;
}
