-- Analytics schema: append-only events for newsletter + commerce.
-- Run: npm run analytics:migrate
-- Safe to point ANALYTICS_DATABASE_URL at a dedicated Neon branch or the core DB.

CREATE SCHEMA IF NOT EXISTS analytics;

CREATE TABLE IF NOT EXISTS analytics.newsletter_signup_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_normalized TEXT NOT NULL,
  source TEXT,
  resource_label TEXT,
  mailpoet_list_id INTEGER,
  core_user_id UUID,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS newsletter_signup_events_email_idx
  ON analytics.newsletter_signup_events (email_normalized);

CREATE INDEX IF NOT EXISTS newsletter_signup_events_created_at_idx
  ON analytics.newsletter_signup_events (created_at DESC);

CREATE INDEX IF NOT EXISTS newsletter_signup_events_source_idx
  ON analytics.newsletter_signup_events (source);

CREATE TABLE IF NOT EXISTS analytics.commerce_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  woocommerce_order_id BIGINT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  currency TEXT,
  total_cents BIGINT,
  customer_email_normalized TEXT,
  core_user_id UUID,
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_payload JSONB,
  ordered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS commerce_orders_email_idx
  ON analytics.commerce_orders (customer_email_normalized);

CREATE INDEX IF NOT EXISTS commerce_orders_ordered_at_idx
  ON analytics.commerce_orders (ordered_at DESC);

CREATE TABLE IF NOT EXISTS analytics.webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  external_id TEXT,
  idempotency_key TEXT UNIQUE,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS webhook_deliveries_provider_idx
  ON analytics.webhook_deliveries (provider, created_at DESC);
