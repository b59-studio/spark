import { getAnalyticsDb } from "@/lib/analytics-db";
import { normalizeAnalyticsEmail } from "@/lib/analytics/normalize-email";
import { resolveCoreUserIdByEmail } from "@/lib/analytics/resolve-core-user-id";
import type { JsonValue } from "@/types/analytics-database";

export type RecordDonationInput = {
  stripePaymentIntentId: string;
  status: string;
  amountCents: number;
  currency: string;
  donorEmail?: string | null;
  rawPayload?: JsonValue;
  donatedAt?: Date | null;
};

/**
 * Map a Stripe PaymentIntent into the analytics donation row shape.
 * Reads only non-sensitive fields; never persists card or auth data.
 */
export function mapPaymentIntentToDonation(
  intent: Record<string, unknown>
): RecordDonationInput {
  const amountRaw = Number(intent.amount_received ?? intent.amount ?? 0);
  const created = Number(intent.created);

  return {
    stripePaymentIntentId: String(intent.id ?? ""),
    status: String(intent.status ?? "unknown"),
    amountCents: Number.isFinite(amountRaw) ? amountRaw : 0,
    currency: intent.currency != null ? String(intent.currency) : "usd",
    donorEmail:
      typeof intent.receipt_email === "string" ? intent.receipt_email : null,
    rawPayload: intent as JsonValue,
    donatedAt: Number.isFinite(created) ? new Date(created * 1000) : null,
  };
}

/**
 * Upsert a donation snapshot for analytics (idempotent on Stripe PaymentIntent id).
 * No-ops when DATABASE_URL is unset.
 */
export async function recordDonation(input: RecordDonationInput): Promise<void> {
  const db = getAnalyticsDb();
  if (!db) return;

  const emailNormalized = input.donorEmail
    ? normalizeAnalyticsEmail(input.donorEmail)
    : null;

  const coreUserId = emailNormalized
    ? await resolveCoreUserIdByEmail(emailNormalized)
    : null;

  await db
    .insertInto("donation_events")
    .values({
      stripe_payment_intent_id: input.stripePaymentIntentId,
      status: input.status,
      amount_cents: input.amountCents,
      currency: input.currency,
      email_normalized: emailNormalized,
      core_user_id: coreUserId,
      raw_payload: input.rawPayload ?? null,
      donated_at: input.donatedAt ?? null,
    })
    .onConflict((oc) =>
      oc.column("stripe_payment_intent_id").doUpdateSet({
        status: input.status,
        amount_cents: input.amountCents,
        currency: input.currency,
        email_normalized: emailNormalized,
        core_user_id: coreUserId,
        raw_payload: input.rawPayload ?? null,
        donated_at: input.donatedAt ?? null,
        updated_at: new Date(),
      })
    )
    .execute();
}
