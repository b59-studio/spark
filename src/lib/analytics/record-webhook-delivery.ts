import { getAnalyticsDb } from "@/lib/analytics-db";
import type { JsonValue } from "@/types/analytics-database";

export async function recordWebhookDelivery(input: {
  provider: string;
  eventType: string;
  externalId?: string;
  idempotencyKey?: string;
  payload: JsonValue;
  processedAt?: Date;
  error?: string;
}): Promise<boolean> {
  const db = getAnalyticsDb();
  if (!db) return false;

  try {
    await db
      .insertInto("webhook_deliveries")
      .values({
        provider: input.provider,
        event_type: input.eventType,
        external_id: input.externalId ?? null,
        idempotency_key: input.idempotencyKey ?? null,
        payload: input.payload,
        processed_at: input.processedAt ?? new Date(),
        error: input.error ?? null,
      })
      .execute();
    return true;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (/duplicate key|unique constraint/i.test(message)) {
      return false;
    }
    throw e;
  }
}
