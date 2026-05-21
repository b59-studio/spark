# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
where applicable.

## [Unreleased]

### Added

- Project documentation: architecture, onboarding, ADRs, analytics DB guide,
  CONTRIBUTING, and LICENSE.
- Analytics schema (`analytics` on Neon) with newsletter, commerce, and webhook
  tables; `npm run analytics:migrate`.
- Headless WordPress client, MailPoet newsletter sync, WooCommerce webhook
  ingestion.
- GROW toolkits data module and nav wiring via `nav-config.ts`.

### Changed

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
