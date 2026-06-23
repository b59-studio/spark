# Cloudways go-live — WordPress, WooCommerce, MailPoet → Neon analytics

Use this checklist once Cloudways sends your application URL and credentials.
The Next.js site stays on Vercel (or your current host); only the CMS runs on
Cloudways.

## What you will need from Cloudways

| Item | Where to find it | Maps to env var |
| ---- | ---------------- | --------------- |
| Application URL | Application dashboard | `WORDPRESS_API_URL`, `MAILPOET_API_BASE_URL`, `WOOCOMMERCE_API_URL` |
| SFTP / SSH (optional) | Server → Master Credentials | Manual plugin install if admin UI is slow |
| MySQL host/user/pass | Application → Access Details | WordPress only (not in Next.js `.env`) |
| Custom domain (later) | Domain Management | e.g. `cms.txspark.org` — update all three `*_URL` vars |

## What you will need from Neon

| Item | Purpose |
| ---- | ------- |
| `DATABASE_URL` | Neon Postgres — core `public` schema + analytics schema `analytics` |

Migrations create/alter only the **`analytics`** schema (`CREATE SCHEMA IF NOT
EXISTS`, `ADD COLUMN IF NOT EXISTS`). They do not touch `public` tables or
Prisma-managed map data.

Apply migrations from this repo:

```bash
DATABASE_URL='postgresql://...' npm run analytics:migrate
```

## What you will need from Vercel (Next.js host)

| Item | Purpose |
| ---- | ------- |
| Production URL | WooCommerce webhook delivery target |
| Env vars below | Server-side calls to WordPress + Neon |

Copy from `env/site.integrations.example` and `env/analytics.example`.

## Phase 1 — WordPress on Cloudways

1. Log in to Cloudways → open your WordPress application.
2. **Domain & SSL:** add `cms.yourdomain.org` (or use the default `*.cloudwaysapps.com` URL for first pass). Install Let's Encrypt and enable HTTPS redirect.
3. Complete the WordPress installer at `/wp-admin/`.
4. **Settings → Permalinks → Post name** (required for REST API).
5. Install and activate:
   - **MailPoet** — newsletter lists
   - **WooCommerce** — products / donations (checkout stays on WordPress)

## Phase 2 — MailPoet → Next.js

1. MailPoet → **Settings → Advanced** → enable API.
2. Copy the API key → `MAILPOET_API_KEY` in Vercel.
3. Note your default list ID (Lists → edit list → ID in URL or list settings) → `MAILPOET_LIST_ID`.
4. Set on Vercel:

   ```bash
   MAILPOET_API_BASE_URL=https://cms.yourdomain.org
   MAILPOET_API_KEY=<from MailPoet>
   MAILPOET_LIST_ID=<optional>
   WORDPRESS_API_URL=https://cms.yourdomain.org
   ```

5. Test: submit the newsletter form on the marketing site → subscriber appears in MailPoet → row in `analytics.newsletter_signup_events`.

## Phase 3 — WooCommerce REST (product reads)

1. WooCommerce → **Settings → Advanced → REST API → Add key**.
2. Description: `txspark-next-read`, user: admin, permissions: **Read**.
3. Set on Vercel:

   ```bash
   WOOCOMMERCE_API_URL=https://cms.yourdomain.org
   WOOCOMMERCE_CONSUMER_KEY=ck_...
   WOOCOMMERCE_CONSUMER_SECRET=cs_...
   ```

Product listing in Next.js uses `src/lib/integrations/woocommerce/client.ts`
when you wire shop pages; checkout remains on WordPress.

## Phase 4 — WooCommerce webhooks → Neon

1. Generate a long random secret (e.g. `openssl rand -base64 32`) → `WOOCOMMERCE_WEBHOOK_SECRET` on Vercel.
2. WooCommerce → **Settings → Advanced → Webhooks → Add webhook**:
   - **Name:** TX*SPARK order sync
   - **Status:** Active
   - **Topic:** Order updated (add **Order created** as a second webhook if you want both)
   - **Delivery URL:** `https://<your-next-site>/api/webhooks/woocommerce`
   - **Secret:** same value as `WOOCOMMERCE_WEBHOOK_SECRET`
3. Place a test order on WordPress → confirm:
   - `analytics.webhook_deliveries` row (`provider = woocommerce`)
   - `analytics.commerce_orders` upsert with `woocommerce_order_id`

## Phase 5 — Link analytics to core users

Analytics tables store `core_user_id` (UUID) when we can match **email** to
the map app's `"User"` table on the same database as `DATABASE_URL`.

**From you:**

1. Confirm `public."User"` has `id` (UUID) and `email` (text).
2. Ensure `DATABASE_URL` on Vercel points at that Neon database.

**How linking works:**

```
newsletter signup / WooCommerce order
        │
        ▼ normalize email
resolveCoreUserIdByEmail()  ──SELECT id FROM "User" WHERE lower(email) = $1
        │
        ▼
analytics.*.core_user_id  (nullable UUID, no FK)
```

If `DATABASE_URL` is unset, analytics writers no-op. If the user table is
missing or no email matches, events still persist with `core_user_id = null`.

## Analytics tables (Neon schema `analytics`)

| Table | Source | Key columns |
| ----- | ------ | ----------- |
| `newsletter_signup_events` | `POST /api/newsletter` after MailPoet sync | `email_normalized`, `mailpoet_subscriber_id`, `mailpoet_list_id`, `core_user_id`, `source`, `payload` |
| `commerce_orders` | WooCommerce `order.*` webhooks | `woocommerce_order_id`, `woocommerce_customer_id`, `status`, `total_cents`, `line_items`, `core_user_id`, `raw_payload` |
| `webhook_deliveries` | All inbound webhooks | idempotency, full payload audit |

Full column reference: [`db/README.md`](../db/README.md).

## Local parity (optional)

```bash
npm run cms:up
# http://localhost:8080 — complete WP installer, install plugins manually
```

Point `.env.local` at `http://localhost:8080`. For webhooks from local
WordPress to local Next.js, use a tunnel (ngrok, Cloudflare Tunnel) and set the
webhook URL to `https://<tunnel>/api/webhooks/woocommerce`.

## Verification checklist

- [ ] Permalinks = Post name
- [ ] MailPoet API key works (newsletter signup → MailPoet list)
- [ ] `DATABASE_URL` set; `npm run analytics:migrate` applied
- [ ] Newsletter signup creates `analytics.newsletter_signup_events` row
- [ ] WooCommerce webhook secret set on Vercel **and** in WP webhook
- [ ] Test order creates/updates `analytics.commerce_orders`
- [ ] Known user email gets `core_user_id` when `"User"` row exists

## Still open after Cloudways credentials

| Gap | Owner / action |
| --- | -------------- |
| Custom CMS domain + SSL | You / DNS |
| Shop or donation pages in Next.js | Product UI not wired yet — REST client exists |
| WordPress-driven blog routes | `fetchWordPressPosts` exists; no pages consume it yet |
| MailPoet opens/clicks | No inbound MailPoet webhooks in v1 — signup events only |
| Webhook retention / PII policy | Ops decision (see ADR 0003) |
| Map merge | `map-migration/` User schema must match `"User"(id, email)` expectation |

## Related docs

- [`infra/hosting/cloudways/README.md`](../infra/hosting/cloudways/README.md) — server setup summary
- [`docs/adr/0002-headless-wordpress-cms.md`](../docs/adr/0002-headless-wordpress-cms.md)
- [`docs/adr/0003-analytics-schema-on-neon-kysely.md`](../docs/adr/0003-analytics-schema-on-neon-kysely.md)
- [`env/site.integrations.example`](../env/site.integrations.example)
