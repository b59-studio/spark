# Cloudways — WordPress CMS template

Full go-live checklist (webhooks, Neon, user linking):
[`wordpress/CLOUDWAYS-GO-LIVE.md`](../../../wordpress/CLOUDWAYS-GO-LIVE.md).

## 1. Create application

1. Log in to [Cloudways](https://www.cloudways.com/).
2. **Add Server** → choose provider (DO, AWS, GCP) and region near Texas users.
3. **Add Application** → **WordPress** on that server.
4. Note the **Application URL**, **MySQL credentials**, and **SSH/SFTP** access.

## 2. Domain & SSL

1. Application → **Domain Management** → add `cms.example.org`.
2. **SSL Certificate** → Let's Encrypt → install.
3. Enable **HTTPS redirect**.

## 3. Install plugins

From WordPress admin (`/wp-admin`):

| Plugin | Purpose |
| ------ | ------- |
| MailPoet | Newsletter lists (API for Next.js signups) |
| WooCommerce | Products / donations |
| (Optional) WP REST Cache | Performance for headless reads |

Enable **Settings → Permalinks → Post name** before testing REST.

## 4. MailPoet API

MailPoet → **Settings** → **Advanced** → enable API → copy key to Vercel:

- `MAILPOET_API_KEY`
- `MAILPOET_API_BASE_URL=https://cms.example.org`
- `MAILPOET_LIST_ID` (optional; default list for new subscribers)
- `WORDPRESS_API_URL=https://cms.example.org`

## 5. WooCommerce REST

WooCommerce → **Settings** → **Advanced** → **REST API** → Add key (Read).

- `WOOCOMMERCE_API_URL`
- `WOOCOMMERCE_CONSUMER_KEY`
- `WOOCOMMERCE_CONSUMER_SECRET`

## 6. WooCommerce webhooks → Neon analytics

1. Generate a secret → `WOOCOMMERCE_WEBHOOK_SECRET` on Vercel.
2. WooCommerce → **Webhooks** → Add:
   - Topic: **Order updated** (and optionally **Order created**)
   - URL: `https://<next-production-domain>/api/webhooks/woocommerce`
   - Secret: same as env var
3. Set `DATABASE_URL` on Vercel and run `npm run analytics:migrate`
   against that Neon database (see [`db/README.md`](../../../db/README.md)).

## 7. Staging

Cloudways supports **Staging Management** per application—use it before plugin upgrades.

## 8. Next.js (unchanged)

Keep the marketing site on Vercel; only the CMS lives on Cloudways. CORS is
usually not required because Next.js calls WordPress **server-side** from API routes.

## Decision: Cloudways vs DigitalOcean direct

| | Cloudways | DO Droplet |
| - | --------- | ---------- |
| Ops | Low (managed updates, backups UI) | You manage OS, PHP, backups |
| Cost | Higher at small scale | Lower raw compute |
| Fit | Fast launch, non-ops team | Comfortable with SSH/Docker |
