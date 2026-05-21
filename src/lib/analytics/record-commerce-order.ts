import { getAnalyticsDb } from "@/lib/analytics-db";
import { normalizeAnalyticsEmail } from "@/lib/analytics/normalize-email";
import { resolveCoreUserIdByEmail } from "@/lib/analytics/resolve-core-user-id";
import type { JsonValue } from "@/types/analytics-database";

export type CommerceLineItem = {
  productId: number;
  name: string;
  quantity: number;
  totalCents: number | null;
};

export type RecordCommerceOrderInput = {
  woocommerceOrderId: number;
  status: string;
  currency?: string | null;
  totalCents?: number | null;
  customerEmail?: string | null;
  lineItems: CommerceLineItem[];
  orderedAt?: Date | null;
  rawPayload?: JsonValue;
};

function parseMoneyToCents(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number.parseFloat(String(value));
  if (Number.isNaN(n)) return null;
  return Math.round(n * 100);
}

/** Map a WooCommerce REST/webhook order payload into analytics row shape. */
export function mapWooCommerceOrderPayload(order: Record<string, unknown>): RecordCommerceOrderInput {
  const lineItemsRaw = Array.isArray(order.line_items) ? order.line_items : [];
  const lineItems: CommerceLineItem[] = lineItemsRaw
    .filter((row): row is Record<string, unknown> => typeof row === "object" && row !== null)
    .map((row) => ({
      productId: Number(row.product_id ?? 0),
      name: String(row.name ?? ""),
      quantity: Number(row.quantity ?? 0),
      totalCents: parseMoneyToCents(row.total),
    }));

  const billing =
    typeof order.billing === "object" && order.billing !== null
      ? (order.billing as Record<string, unknown>)
      : {};

  return {
    woocommerceOrderId: Number(order.id),
    status: String(order.status ?? "unknown"),
    currency: order.currency != null ? String(order.currency) : null,
    totalCents: parseMoneyToCents(order.total),
    customerEmail:
      typeof billing.email === "string"
        ? billing.email
        : typeof order.customer_email === "string"
          ? order.customer_email
          : null,
    lineItems,
    orderedAt: order.date_created ? new Date(String(order.date_created)) : null,
    rawPayload: order as JsonValue,
  };
}

/**
 * Upsert commerce order snapshot for analytics (idempotent on WooCommerce order id).
 */
export async function recordCommerceOrder(
  input: RecordCommerceOrderInput
): Promise<void> {
  const db = getAnalyticsDb();
  if (!db) return;

  const customerEmailNormalized = input.customerEmail
    ? normalizeAnalyticsEmail(input.customerEmail)
    : null;

  const coreUserId = customerEmailNormalized
    ? await resolveCoreUserIdByEmail(customerEmailNormalized)
    : null;

  await db
    .insertInto("commerce_orders")
    .values({
      woocommerce_order_id: input.woocommerceOrderId,
      status: input.status,
      currency: input.currency ?? null,
      total_cents: input.totalCents ?? null,
      customer_email_normalized: customerEmailNormalized,
      core_user_id: coreUserId,
      line_items: input.lineItems as JsonValue,
      raw_payload: input.rawPayload ?? null,
      ordered_at: input.orderedAt ?? null,
    })
    .onConflict((oc) =>
      oc.column("woocommerce_order_id").doUpdateSet({
        status: input.status,
        currency: input.currency ?? null,
        total_cents: input.totalCents ?? null,
        customer_email_normalized: customerEmailNormalized,
        core_user_id: coreUserId,
        line_items: input.lineItems as JsonValue,
        raw_payload: input.rawPayload ?? null,
        ordered_at: input.orderedAt ?? null,
        updated_at: new Date(),
      })
    )
    .execute();
}
