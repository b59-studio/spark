# ADR 0002: Headless WordPress for CMS, MailPoet, and WooCommerce

**Status:** Accepted  
**Date:** 2026-05-20

## Context

Editors need a familiar CMS for posts and pages. Newsletter operations use
**MailPoet** (WordPress plugin). Small-commerce flows use **WooCommerce** on
the same host. Rebuilding CMS, email lists, and checkout in Next.js would
duplicate mature plugins and slow content teams.

Alternatives: Sanity/Contentful (no MailPoet/Woo native), custom Postgres CMS,
or WordPress as the public theme (not headless).

## Decision

Run **WordPress 6** on MariaDB as the system of record for content and
commerce plugins. The Next.js app calls the **REST API** (`/wp-json/wp/v2`)
via `src/lib/integrations/wordpress/` and integrates MailPoet and WooCommerce
through their HTTP APIs and webhooks.

- **Local dev:** `wordpress/docker-compose.yml` (`npm run cms:up`)
- **Production:** VPS templates under `infra/hosting/` (DigitalOcean or Cloudways)
- **Secrets:** `WORDPRESS_API_URL`, MailPoet and Woo keys in `env/site.integrations.example`

## Consequences

**Positive**

- Editors use standard WP admin; plugins update on their own release cycles.
- Webhooks push order events into our analytics DB without polling.

**Negative**

- Two runtimes to secure, patch, and back up (Node + PHP).
- Local Next → Docker WordPress networking can be awkward; staging URLs often
  work better than `localhost:8080` from Vercel previews.
- Application Passwords required for protected/draft content fetches.

**Follow-ups**

- Expand REST usage (menus, custom post types) as content model stabilizes.
- Document staging CMS URL for all developers in the team secret store.
