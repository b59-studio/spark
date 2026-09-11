# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
where applicable.

## [Unreleased]

### Added

- `docs/runbooks/jfseamus-decommission.md` — the ordered decommission plan for
  the reclaimed domain, with the surveyed state of every host and which access
  each remaining step needs.
- Cloudways go-live runbook: `wordpress/CLOUDWAYS-GO-LIVE.md` (plugins, webhooks,
  Neon migrations, core user linking).
- Analytics migration `002_plugin_external_ids.sql` (MailPoet subscriber id,
  WooCommerce customer id, payment method).
- Multi-file analytics migrate runner (`scripts/analytics-migrate.ts`).
- Project documentation: architecture, onboarding, ADRs, analytics DB guide,
  CONTRIBUTING, and LICENSE.
- Analytics schema (`analytics` on Neon) with newsletter, commerce, and webhook
  tables; `npm run analytics:migrate`.
- Headless WordPress client, MailPoet newsletter sync, WooCommerce webhook
  ingestion.
- GROW toolkits data module and nav wiring via `nav-config.ts`.

### Fixed

- Favicon paths disagreed after the palette revert: `/favicon.ico` served the
  gold spark, but `src/app/icon.png` (Next's auto icon, served at `/icon.png`)
  held the stock Next.js placeholder and `public/images/brand/favicon.ico` had
  been dropped. Both now carry the gold spark, matching the other two paths.
  The icon the site serves from `/favicon.ico` is unchanged.
- Mobile header: the wordmark claimed 60vw of the bar and pushed the menu button
  clean off a 375px screen, so phone visitors had no way to open the navigation.
  The wordmark now yields to the bar's controls at any width, Log In no longer
  wraps to two lines, and the menu button has a 44x44 hit area instead of 24x24.
- `/toolkits` could be swiped ~1380px sideways into blank space on a phone: the
  carousel's slides inflated the document's scroll width, which `main`'s
  `overflow-x: hidden` does not prevent. Paint containment on the scroller stops
  it; the carousel scrolls exactly as before.
- `/contact` served an empty page while `sitemap.xml` and `/about/sitemap` both
  advertised it. The route now returns 404, is out of both sitemaps, and the
  sitemap page's "Talk to Us" button points at the contact address.

### Changed

- Light theme: panels, callouts and form fields are white on the paper page
  instead of the warm earth tan. Fields and the resting home-page tabs take a
  purple hairline, since gold on white falls below the 3:1 contrast a control
  boundary needs. The selected home-page tab fills purple. Dark theme unchanged.
- Canonical host is `www.texasspark.org`: the apex 307s to `www`, so the
  `NEXT_PUBLIC_SITE_URL` fallback in `layout.tsx`, `robots.ts` and `sitemap.ts`
  no longer generates canonical links and sitemap entries that redirect.
- Every reference to `jfseamus.com` now points at `www.texasspark.org` /
  `cms.texasspark.org` / `login.texasspark.org`, including the three live
  fallbacks (`next.config.ts`, `Header.tsx`, `.mcp.json`). The handbook's
  "Migrating the domain" section is now "Where the site lives" and records the
  finished state. **The runtime values still live in Doppler:**
  `NEXT_PUBLIC_LOGIN_URL` and `WOOCOMMERCE_API_URL` both still hold jfseamus
  hosts and must be updated there before the domain is handed back.
- Reverted the v3 heritage-quilt repaint: the site is back on the dark cosmic
  palette (`spark-void` ground, `spark-star` gold accents) with the light theme
  available via the header toggle. Restores the cosmic-era wordmark and spark
  artwork; removes the quilt-band divider and the bone-ground favicon.
- Toolkits: the six-step organizing cycle is shown again as a scroll-snap
  carousel with dot navigation, sitting directly under the `/toolkits` title and
  above the prose.
- The eleven prose routes (`/about`, `/about/mission`, `/about/people`,
  `/about/partners`, `/about/data`, `/about/sitemap`, `/about/privacy`,
  `/about/terms`, `/work`, `/events`, `/toolkits`) render their in-code layouts
  again instead of WordPress page bodies. WordPress returned the same copy
  flattened into plain prose, which dropped the framed panels, card grids,
  toolkit carousel, calendar embed, newsletter form, and call-to-action buttons
  those pages are built from. The routes now prerender as static HTML with no
  per-revalidation CMS fetch. `CmsPage` stays in the tree, unwired, so a route
  can be handed back to the CMS one line at a time.
- `CmsPage` takes an optional `afterTitle` slot, for a route that needs an
  in-code block between the CMS page title and the CMS body.
- Analytics and core user linking use single `DATABASE_URL` (replaces
  `ANALYTICS_DATABASE_URL` and `CORE_DATABASE_URL`).
- MailPoet subscribe captures `mailpoet_subscriber_id` on analytics signup events.
- WooCommerce order mapper stores `woocommerce_customer_id` and `payment_method`.
- WordPress README and Cloudways hosting doc aligned with go-live checklist.
- README rewritten for Next.js + WordPress + Neon analytics (map stack noted
  as `map-migration/` worktree).

## [0.1.0] - 2026-05-20

### Added

- Next.js 16 App Router marketing site (React 19, Tailwind 4).
- Newsletter signup API with MailPoet and Resend fallback.
- WooCommerce webhook route with HMAC verification in production.
- Vitest for integration and analytics unit tests.
- Local WordPress docker-compose (`npm run cms:up`).
- Hosting templates under `infra/hosting/` for CMS on DigitalOcean or Cloudways.

### Security

- WooCommerce webhooks require `WOOCOMMERCE_WEBHOOK_SECRET` in production.
- Contact and integration hardening (see git history `97383f3`).

### Note

District map, PostGIS, Mapbox, and ETL pipelines are actively developed in
the `map-migration/` worktree and are not part of this release tag on `main`.

[Unreleased]: https://github.com/b59-studio/spark/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/b59-studio/spark/releases/tag/v0.1.0
