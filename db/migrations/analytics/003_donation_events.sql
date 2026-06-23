-- On-site donations (Stripe) — append/upsert snapshot keyed by PaymentIntent.
-- Run: npm run analytics:migrate
-- Safe to run against DATABASE_URL; only creates/alters schema analytics.

CREATE SCHEMA IF NOT EXISTS analytics;

CREATE TABLE IF NOT EXISTS analytics.donation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  amount_cents BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  email_normalized TEXT,
  core_user_id UUID,
  raw_payload JSONB,
  donated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS donation_events_email_idx
  ON analytics.donation_events (email_normalized)
  WHERE email_normalized IS NOT NULL;

CREATE INDEX IF NOT EXISTS donation_events_donated_at_idx
  ON analytics.donation_events (donated_at DESC);

CREATE INDEX IF NOT EXISTS donation_events_core_user_idx
  ON analytics.donation_events (core_user_id)
  WHERE core_user_id IS NOT NULL;
