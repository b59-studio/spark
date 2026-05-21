# ADR 0001: Next.js App Router for the public site

**Status:** Accepted  
**Date:** 2026-05-20

## Context

TX*SPARK needs a fast, SEO-friendly public site with server-rendered pages,
API routes for newsletter and webhooks, and a path to deploy on Vercel.
The team already uses React and TypeScript. Alternatives included a static
site generator, a separate API service, or WordPress as the full front end.

## Decision

Use **Next.js 16** with the **App Router** (`src/app/`), React 19, and
Tailwind CSS 4. Keep route handlers thin; put business logic in `src/lib/`.

Deploy the marketing app on **Vercel** (existing workflow, `npm run env:pull`).

## Consequences

**Positive**

- Single repo for pages, API routes, and shared types.
- Built-in ISR/revalidation for future WordPress-driven pages.
- Strong ecosystem for react-email, Vitest, and Vercel previews.

**Negative**

- Map and PostGIS concerns do not fit cleanly in serverless limits; map work
  stays in a separate worktree until decided (see ADR 0004).
- Bundle size and build time grow as map code is re-integrated.

**Follow-ups**

- Re-enable `/contact` and other temporarily disabled routes when ready.
- Add `openapi.yaml` if public API surface grows beyond a few routes.
