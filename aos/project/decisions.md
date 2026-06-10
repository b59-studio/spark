# Decisions

> Every significant architectural, process, or tooling decision goes here. The goal is that future agents (and humans) never have to re-litigate a decision that was already thought through.

---

## Template

```
## YYYY-MM-DD — [Decision title]

**Decision:** [What was decided, in one sentence]

**Context:** [Why this decision needed to be made]

**Alternatives considered:**
- [Option A]
- [Option B]

**Reasoning:** [Why this option over the others]

**Tradeoffs:** [What we gave up, or what could go wrong]
```

---

<!-- Add entries above this line, newest first -->

> The four entries below summarize the ADRs in `docs/adr/`. They are pointers,
> not replacements — read the full ADR for context, consequences, and follow-ups.

## 2026-05-20 — Map stack stays in `map-migration/` worktree until merge (ADR 0004)

**Decision:** Keep active map development (district explorer + household spark map)
in a parallel `map-migration/` tree; `main` describes only the marketing +
integrations system until the destination architecture is chosen.

**Reasoning:** Lets marketing releases proceed without forcing contributors to
install Mapbox/PostGIS/ETL tooling while map boundaries, modes, and auth are
still in flux.

**Tradeoffs:** Drift risk between `src/` map files and `map-migration/src/`;
duplicated CI; newcomer confusion. Open follow-up: choose merged monorepo vs.
separate deployable vs. organizer-only host, then supersede this ADR.
Full ADR: `docs/adr/0004-map-stack-migration-worktree.md`.

## 2026-05-20 — Analytics schema on Neon with Kysely + SQL migrations (ADR 0003)

**Decision:** Store marketing events (newsletter signups, WooCommerce orders) in
a Postgres `analytics` schema on Neon; DDL via checked-in SQL
(`db/migrations/analytics/*.sql`); access via Kysely with hand-maintained types;
all writers no-op when `DATABASE_URL` is unset.

**Reasoning:** Clean separation from map/core schema, reviewable idempotent SQL,
and a serverless-friendly client; local/preview deploys work without a DB.

**Tradeoffs:** Two migration systems if map Prisma merges later; types must be
updated by hand when SQL changes; no migration ledger table yet.
Full ADR: `docs/adr/0003-analytics-schema-on-neon-kysely.md`.

## 2026-05-20 — Headless WordPress for CMS, MailPoet, WooCommerce (ADR 0002)

**Decision:** Run WordPress 6 on MariaDB as the system of record for content and
commerce plugins; the Next.js app calls the REST API and integrates MailPoet and
WooCommerce via HTTP APIs and webhooks.

**Reasoning:** Reuses mature plugins (editor CMS, newsletter, checkout) instead
of rebuilding them in Next.js; webhooks push order events into analytics without
polling.

**Tradeoffs:** Two runtimes to secure/patch/back up (Node + PHP); awkward
local Next → Docker WP networking; Application Passwords needed for draft content.
Full ADR: `docs/adr/0002-headless-wordpress-cms.md`.

## 2026-05-20 — Next.js App Router for the public site (ADR 0001)

**Decision:** Build the public site with Next.js 16 (App Router), React 19, and
Tailwind 4; keep route handlers thin with logic in `src/lib/`; deploy on Vercel.

**Reasoning:** Single repo for pages, API routes, and shared types; built-in
ISR/revalidation for future WordPress-driven pages; strong ecosystem fit.

**Tradeoffs:** Map/PostGIS concerns don't fit serverless limits (hence the
separate worktree); bundle/build time grow as map code is re-integrated.
Full ADR: `docs/adr/0001-nextjs-app-router-marketing-site.md`.
