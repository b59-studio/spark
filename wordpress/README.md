# Headless WordPress (TX*SPARK CMS)

This folder documents the **WordPress.org** stack that powers content, MailPoet,
and WooCommerce while the public site stays on Next.js.

## Architecture

```
┌─────────────────┐     REST (wp/v2)      ┌──────────────────────┐
│  Next.js site   │ ◄────────────────────►│  WordPress (cms)     │
│  (Vercel/DO)    │     MailPoet API      │  + MailPoet plugin   │
│                 │ ◄────────────────────►│  + WooCommerce       │
└────────┬────────┘     wc/v3 + webhooks └──────────────────────┘
         │
         │  newsletter + order events
         ▼
┌─────────────────┐
│ Neon Postgres   │  schema `analytics` (separate from map `public`)
└─────────────────┘
```

## Production (Cloudways)

Follow **[CLOUDWAYS-GO-LIVE.md](./CLOUDWAYS-GO-LIVE.md)** for the full checklist:
plugins, API keys, webhooks, Neon migrations, and user linking.

Short version: [`infra/hosting/cloudways/README.md`](../infra/hosting/cloudways/README.md).

## WordPress setup checklist

1. Install WordPress on your chosen host (see `infra/hosting/`).
2. Enable **pretty permalinks** (Settings → Permalinks → Post name).
3. Install plugins:
   - **MailPoet** — newsletters and list management
   - **WooCommerce** — products/donations (checkout on WordPress)
4. Create an **Application Password** (Users → Profile) for server-side fetches if you need drafts/previews.
5. MailPoet: Settings → Advanced → copy **API key** into `MAILPOET_API_KEY`.
6. WooCommerce: Settings → Advanced → REST API → create key with Read access.
7. WooCommerce: Settings → Advanced → Webhooks → point **Order updated** at
   `https://<next-site>/api/webhooks/woocommerce` with `WOOCOMMERCE_WEBHOOK_SECRET`.

## Local development

```bash
npm run cms:up
# Site: http://localhost:8080
# Admin: http://localhost:8080/wp-admin/ (complete installer on first visit)
```

Install MailPoet and WooCommerce from the WordPress plugin screen after the
installer finishes. Database credentials are in `docker-compose.yml` (MariaDB
user/password `wordpress`).

Point `.env.local` at `http://localhost:8080` for `WORDPRESS_API_URL`,
`MAILPOET_API_BASE_URL`, and `WOOCOMMERCE_API_URL`.

Stop CMS containers:

```bash
npm run cms:down
```

## Next.js integration

| Concern | Code |
| ------- | ---- |
| Posts / pages | `src/lib/integrations/wordpress/client.ts` |
| Newsletter | `src/lib/integrations/mailpoet/subscribe.ts` via `/api/newsletter` |
| Products | `src/lib/integrations/woocommerce/client.ts` |
| Order webhooks | `src/app/api/webhooks/woocommerce/route.ts` → Neon `analytics.commerce_orders` |
| Analytics writers | `src/lib/analytics/` |

Env templates: `env/site.integrations.example`, `env/analytics.example`.
