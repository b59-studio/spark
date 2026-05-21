-- Plugin external IDs for cross-system joins (MailPoet subscriber, WooCommerce customer).
-- Safe on an existing Neon database: only alters analytics schema tables.

ALTER TABLE analytics.newsletter_signup_events
  ADD COLUMN IF NOT EXISTS mailpoet_subscriber_id BIGINT;

CREATE INDEX IF NOT EXISTS newsletter_signup_events_mailpoet_subscriber_idx
  ON analytics.newsletter_signup_events (mailpoet_subscriber_id)
  WHERE mailpoet_subscriber_id IS NOT NULL;

ALTER TABLE analytics.commerce_orders
  ADD COLUMN IF NOT EXISTS woocommerce_customer_id BIGINT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT;

CREATE INDEX IF NOT EXISTS commerce_orders_wc_customer_idx
  ON analytics.commerce_orders (woocommerce_customer_id)
  WHERE woocommerce_customer_id IS NOT NULL;
