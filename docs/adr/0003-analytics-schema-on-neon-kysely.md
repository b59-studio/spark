# ADR 0003: Analytics schema on Neon with Kysely and SQL migrations

**Status:** Accepted  
**Date:** 2026-05-20

## Context

We need durable, queryable records for newsletter signups and WooCommerce
orders without blocking the user-facing request path. The map application
may use Prisma + PostGIS on Neon for core users and geometry. Marketing
analytics is append-heavy, schema-simple, and should be isolatable for
compliance and cost.

Alternatives: log-only (Datadog), warehouse ETL only, Prisma for everything,
or Airtable (already a dependency elsewhere but weak for webhook replay).

## Decision

- Store marketing events in Postgres schema **`analytics`** on **Neon**.
- Apply DDL via checked-in SQL: `db/migrations/analytics/*.sql`, run with
  `npm run analytics:migrate`.
- Access data with **Kysely** and hand-maintained types in
  `src/types/analytics-database.ts` (`.withSchema("analytics")`).
- Make all writers **no-op** when `ANALYTICS_DATABASE_URL` is unset so local
  and preview deploys work without a database.

Optional `CORE_DATABASE_URL` links events to map `User` rows when the map DB
is available.

## Consequences

**Positive**

- Clear separation from map/core schema; can use a dedicated Neon branch.
- SQL migrations are easy to review and idempotent for ops.
- Kysely is lightweight and fits serverless connection pooling patterns.

**Negative**

- Two migration systems if map Prisma merges later (SQL + Prisma).
- Types must be updated manually when SQL changes.
- No ORM-level migration history table yet — track applied files in runbooks.

**Follow-ups**

- Add `002_*.sql` when new event types ship; consider a migration ledger table.
- Define retention/archival policy for `webhook_deliveries.payload`.
