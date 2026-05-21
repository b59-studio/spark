# Analytics database

Marketing analytics for TX*Spark lives in a dedicated Postgres **`analytics`**
schema. The web app writes append-only events from newsletter signups and
WooCommerce webhooks using **Kysely** (`src/lib/analytics-db.ts`).

## Connection

Set in `.env.local` (see [`env/analytics.example`](../env/analytics.example)):

```bash
ANALYTICS_DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

Recommended: a **Neon branch** or project used only for analytics so migrations
and experiments do not affect the map/core database.

Optional cross-link to map users:

```bash
CORE_DATABASE_URL=postgresql://...   # read-only access to public.User if needed
```

Used by `src/lib/analytics/resolve-core-user-id.ts` to populate
`core_user_id` on events when configured.

## Migrations

| File | Purpose |
| ---- | ------- |
| `migrations/analytics/001_init.sql` | Creates `analytics` schema and three tables |

Apply locally or in CI:

```bash
npm run analytics:migrate
```

The script (`scripts/analytics-migrate.ts`) reads `ANALYTICS_DATABASE_URL`,
executes the SQL file in order, and exits non-zero if the URL is missing.

**Adding a migration:**

1. Add `migrations/analytics/002_description.sql` (idempotent DDL preferred:
   `IF NOT EXISTS`).
2. Document the change in this README and [`CHANGELOG.md`](../CHANGELOG.md).
3. Update Kysely types in `src/types/analytics-database.ts` and any insert
   code under `src/lib/analytics/`.
4. Run `npm run analytics:migrate` against a dev branch before production.

There is no automatic migration runner in production yet — apply through your
Neon workflow or release checklist.

## Schema overview

### `analytics.newsletter_signup_events`

Records each successful signup (after MailPoet or fallback path).

| Column | Notes |
| ------ | ----- |
| `email_normalized` | Lowercased email for dedup/reporting |
| `source`, `resource_label` | Attribution from the signup form |
| `mailpoet_list_id` | List used when MailPoet is configured |
| `core_user_id` | Optional UUID link to map `User` |
| `payload` | JSONB for extra fields |
| `created_at` | Event time |

Indexes: `email_normalized`, `created_at DESC`, `source`.

Writer: `src/lib/analytics/record-newsletter-signup.ts` (no-op if DB unset).

### `analytics.commerce_orders`

Upserted from WooCommerce `order.*` webhooks.

| Column | Notes |
| ------ | ----- |
| `woocommerce_order_id` | Unique external id |
| `status`, `currency`, `total_cents` | Order summary |
| `customer_email_normalized` | For reporting |
| `line_items`, `raw_payload` | JSONB |
| `ordered_at`, `created_at`, `updated_at` | Timestamps |

Writer: `src/lib/analytics/record-commerce-order.ts`.

### `analytics.webhook_deliveries`

Audit log for inbound webhooks (idempotency, errors, replay debugging).

| Column | Notes |
| ------ | ----- |
| `provider` | e.g. `woocommerce` |
| `event_type` | Topic header value |
| `idempotency_key` | Unique when present |
| `payload` | Full body JSONB |
| `processed_at`, `error` | Processing outcome |

Writer: `src/lib/analytics/record-webhook-delivery.ts`.

## Application access

```typescript
import { getAnalyticsDb, isAnalyticsDbConfigured } from "@/lib/analytics-db";

const db = getAnalyticsDb();
if (!db) {
  // ANALYTICS_DATABASE_URL not set — skip persistence
}
```

The client uses `.withSchema("analytics")` so table names in Kysely omit the
schema prefix.

## Operations

- **Backups:** rely on Neon PITR / branch snapshots for the analytics project.
- **PII:** tables store normalized emails and webhook payloads — restrict DB
  access and avoid copying production data to unsecured laptops.
- **Retention:** no automatic purge yet; define a retention job if volume grows.

## Related docs

- [`docs/architecture.md`](../docs/architecture.md) — how analytics fits the system
- [`env/analytics.example`](../env/analytics.example) — env template
- [`src/app/api/webhooks/woocommerce/route.ts`](../src/app/api/webhooks/woocommerce/route.ts) — webhook entrypoint
