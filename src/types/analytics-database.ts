import type { ColumnType, Generated } from "kysely";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface NewsletterSignupEventTable {
  id: Generated<string>;
  email_normalized: string;
  source: string | null;
  resource_label: string | null;
  mailpoet_list_id: number | null;
  mailpoet_subscriber_id: number | null;
  core_user_id: string | null;
  payload: ColumnType<JsonValue | null, JsonValue | null, JsonValue | null>;
  created_at: ColumnType<Date, string | Date | undefined, string | Date>;
}

export interface CommerceOrderTable {
  id: Generated<string>;
  woocommerce_order_id: number;
  status: string;
  currency: string | null;
  total_cents: number | null;
  customer_email_normalized: string | null;
  woocommerce_customer_id: number | null;
  payment_method: string | null;
  core_user_id: string | null;
  line_items: ColumnType<JsonValue, JsonValue, JsonValue>;
  raw_payload: ColumnType<JsonValue | null, JsonValue | null, JsonValue | null>;
  ordered_at: ColumnType<Date | null, string | Date | null, string | Date | null>;
  created_at: ColumnType<Date, string | Date | undefined, string | Date>;
  updated_at: ColumnType<Date, string | Date | undefined, string | Date>;
}

export interface WebhookDeliveryTable {
  id: Generated<string>;
  provider: string;
  event_type: string;
  external_id: string | null;
  idempotency_key: string | null;
  payload: ColumnType<JsonValue, JsonValue, JsonValue>;
  processed_at: ColumnType<Date | null, string | Date | null, string | Date | null>;
  error: string | null;
  created_at: ColumnType<Date, string | Date | undefined, string | Date>;
}

/** Kysely schema `analytics` — use `.withSchema('analytics')` on the client. */
export interface AnalyticsDatabase {
  newsletter_signup_events: NewsletterSignupEventTable;
  commerce_orders: CommerceOrderTable;
  webhook_deliveries: WebhookDeliveryTable;
}
