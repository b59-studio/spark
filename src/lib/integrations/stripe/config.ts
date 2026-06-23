/**
 * Stripe.js (browser) configuration for on-site checkout.
 *
 * Only the PUBLISHABLE key is used client-side — it is safe to expose and is the
 * standard `pk_...` value Stripe.js needs to tokenize a card. The secret key and
 * the charge itself live entirely in WordPress (the WooCommerce Stripe gateway);
 * this app never sees a secret or raw card data.
 *
 * Returns null when the publishable key is absent, so the checkout can render a
 * graceful "payment not configured" state instead of failing.
 */

export type StripeBrowserConfig = {
  publishableKey: string;
};

export function getStripeBrowserConfig(): StripeBrowserConfig | null {
  // NEXT_PUBLIC_ prefix is required for the value to reach the browser bundle.
  const publishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
  if (!publishableKey) return null;
  return { publishableKey };
}
