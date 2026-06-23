import Stripe from "stripe";
import { getStripeConfig } from "@/lib/integrations/stripe/config";

const globalForStripe = globalThis as unknown as {
  stripeClient: Stripe | null;
};

/**
 * Server-side Stripe client. Returns null when keys are unset so callers can
 * degrade gracefully (no live API calls without configuration).
 */
export function getStripeServerClient(): Stripe | null {
  const config = getStripeConfig();
  if (!config) return null;

  if (!globalForStripe.stripeClient) {
    globalForStripe.stripeClient = new Stripe(config.secretKey, {
      apiVersion: config.apiVersion,
      typescript: true,
    });
  }

  return globalForStripe.stripeClient;
}
