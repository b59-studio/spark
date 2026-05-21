# Headless WordPress (TX*Spark CMS)

This folder documents the **WordPress.org** stack that powers content, MailPoet,
and WooCommerce while the public site stays on Next.js.

## Architecture

```
┌─────────────────┐     REST (wp/v2)      ┌──────────────────────┐
│  Next.js site   │ ◄────────────────────►│  WordPress (cms)     │
│  (Vercel/DO)    │     MailPoet API      │  + MailPoet plugin   │
│                 │ ◄────────────────────►│  + WooCommerce       │
└─────────────────┘     wc/v3             └──────────────────────┘
```

## WordPress setup checklist

1. Install WordPress on your chosen host (see `infra/hosting/`).
2. Enable **pretty permalinks** (Settings → Permalinks → Post name).
3. Install plugins:
   - **MailPoet** — newsletters and list management
   - **WooCommerce** — products/donations (if selling on-site)
   - **WPGraphQL** or use core REST only (this repo uses REST in `src/lib/integrations/wordpress/`)
4. Create an **Application Password** (Users → Profile) for server-side fetches if you need drafts/previews.
5. MailPoet: Settings → Advanced → copy **API key** into `MAILPOET_API_KEY`.
6. WooCommerce: Settings → Advanced → REST API → create key with Read access (or Read/Write if syncing orders).

## Local development

```bash
cd wordpress
docker compose up -d
# Site: http://localhost:8080
# Admin: http://localhost:8080/wp-admin  (user/pass in docker-compose.yml)
```

Point `.env` at `http://localhost:8080` for `WORDPRESS_API_URL` and `MAILPOET_API_BASE_URL`.

## Next.js integration

| Concern | Code |
| ------- | ---- |
| Posts / pages | `src/lib/integrations/wordpress/client.ts` |
| Newsletter | `src/lib/integrations/mailpoet/subscribe.ts` via `/api/newsletter` |
| Products | `src/lib/integrations/woocommerce/client.ts` |

Env template: `env/site.integrations.example`.
