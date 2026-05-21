import { getAnalyticsDb } from "@/lib/analytics-db";
import { normalizeAnalyticsEmail } from "@/lib/analytics/normalize-email";
import { resolveCoreUserIdByEmail } from "@/lib/analytics/resolve-core-user-id";
import type { JsonValue } from "@/types/analytics-database";

export type RecordNewsletterSignupInput = {
  email: string;
  source?: string;
  resourceLabel?: string;
  mailpoetListId?: number;
  mailpoetSubscriberId?: number;
  payload?: Record<string, JsonValue>;
};

/**
 * Append-only newsletter signup event for metrics / exports.
 * No-op when DATABASE_URL is unset.
 */
export async function recordNewsletterSignup(
  input: RecordNewsletterSignupInput
): Promise<void> {
  const db = getAnalyticsDb();
  if (!db) return;

  const emailNormalized = normalizeAnalyticsEmail(input.email);
  const coreUserId = await resolveCoreUserIdByEmail(emailNormalized);

  await db
    .insertInto("newsletter_signup_events")
    .values({
      email_normalized: emailNormalized,
      source: input.source ?? null,
      resource_label: input.resourceLabel ?? null,
      mailpoet_list_id: input.mailpoetListId ?? null,
      mailpoet_subscriber_id: input.mailpoetSubscriberId ?? null,
      core_user_id: coreUserId,
      payload: input.payload ?? null,
    })
    .execute();
}
