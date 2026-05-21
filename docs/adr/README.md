# Architecture Decision Records (ADRs)

We document significant technical decisions here so future contributors
understand *why* the codebase looks the way it does.

## Format

Each ADR is numbered `NNNN-short-title.md` and includes:

- **Status** — Proposed | Accepted | Superseded
- **Context** — forces and constraints
- **Decision** — what we chose
- **Consequences** — trade-offs and follow-ups

Do not backfill historical decisions that are no longer relevant. Add a new ADR
when reversing or replacing a decision (mark the old one Superseded).

## Index

| ADR | Title | Status |
| --- | --- | --- |
| [0001](0001-nextjs-app-router-marketing-site.md) | Next.js App Router for the public site | Accepted |
| [0002](0002-headless-wordpress-cms.md) | Headless WordPress for CMS, MailPoet, WooCommerce | Accepted |
| [0003](0003-analytics-schema-on-neon-kysely.md) | Analytics schema on Neon with Kysely + SQL migrations | Accepted |
| [0004](0004-map-stack-migration-worktree.md) | Map stack in `map-migration/` worktree until merge | Accepted |
