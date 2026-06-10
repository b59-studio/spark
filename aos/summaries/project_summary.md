# Project Summary

> 500-word max. A new agent should understand the project, its current state, and its priorities after reading this file plus `current_sprint.md` and `active_task.md`. Write for a smart agent with no prior context.

---

## What This Is

TX*SPARK is a Next.js public site for grassroots civic organizing in Texas. It
serves marketing pages, GROW toolkits, and newsletter signup, plus API routes
that connect to a headless WordPress CMS (content, MailPoet newsletters,
WooCommerce commerce) and an analytics Postgres schema on Neon. A separate
map-migration worktree holds the district/household map stack (Mapbox, PostGIS,
ETL) until its target architecture is decided and it is merged.

## Who It's For

Public visitors and organizers (the web app), CMS editors (WordPress admin),
and internal reporting (commerce + newsletter events flow into Neon analytics).

## Current State

The marketing + integrations system on `main` is the active codebase. Newsletter
signup and the WooCommerce order webhook write to the Neon `analytics` schema;
all analytics writers no-op when `DATABASE_URL` is unset, so local/preview
deploys work without a database. Headless WordPress content fetch is partial.
Magic-link auth exists in `lib/auth/` (used heavily in map flows) but marketing-
site login is not fully wired into nav. The map stack lives in `map-migration/`
and is intentionally kept out of the main tree.

## Architecture in One Paragraph

Next.js 16 / React 19 / Tailwind 4 app deployed on Vercel. Thin route handlers
in `src/app/`; business logic in `src/lib/` (integrations for WordPress,
MailPoet, WooCommerce; analytics recorders; auth). Data flows: visitor signups
and WooCommerce webhooks land in Neon `analytics` (accessed via Kysely with
hand-maintained types); WordPress is the system of record for content/commerce
plugins, reached over REST. Map product (when enabled) uses its own Neon branch
and static GeoJSON on Cloudflare R2. See `docs/architecture.md` for the full C4
diagrams and sequences.

## Key Files for a New Agent

```
aos/summaries/project_summary.md     ← you are here
aos/execution/current_sprint.md      ← what we're doing now
aos/execution/active_task.md         ← what the last agent was doing
aos/project/decisions.md             ← why things are the way they are
aos/intelligence/lessons_learned.md  ← what has failed before
aos/intelligence/patterns.md         ← what has worked before
```

- `docs/architecture.md` — full system overview (C4, sequences, "where do I look when…")
- `docs/adr/` — architecture decision records (0001–0004)
- `docs/onboarding.md` — local setup walkthrough
- `docs/SETUP.md` — detailed environment setup
- `docs/DESIGN_SYSTEM.md` — TX*SPARK design tokens (canonical)
- `standards/99-project-overrides.md` — repo layout overrides + layer rules

## What To Avoid

- Don't import `components/` or `app/*` from `lib/*` (layer rule; see overrides).
- Don't assume map scripts in older READMEs apply to `main` — map code lives in
  `map-migration/` and may have drifted from `src/` (see ADR 0004).
- Don't put business logic in route handlers — keep `app/*` handlers thin.
- Don't log PII; webhook payloads in the `analytics` schema are sensitive.
- Don't write `.md` files at the repo root — route to `docs/` per the AOS map.
