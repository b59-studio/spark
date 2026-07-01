-- Retire on-site donation analytics — product moved to a different donation path.
-- Drops the table formerly created by 003_donation_events.sql (now removed) and
-- its indexes (dropped implicitly with the table). Idempotent: no-op where the
-- table was never created.
-- Run: npm run analytics:migrate

DROP TABLE IF EXISTS analytics.donation_events;
