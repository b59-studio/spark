# Onboarding — TX*Spark

> **Goal:** by the end of this guide (~2 hours), you can run the app locally,
> run tests, find the code you need, and verify a small change.

## 0. Prerequisites

- **Node.js 20+** and **npm 11+** (repo pins `npm@11.6.2` via `packageManager`)
- **Git** and a GitHub account with access to `b59-studio/spark`
- **Docker Desktop** (optional) — only for local WordPress (`npm run cms:up`)
- A Postgres client (optional) — TablePlus, `psql`, or Neon console

## 1. Get the code running locally

```bash
git clone https://github.com/b59-studio/spark.git
cd spark
npm install

cp env/site.integrations.example .env.local
```

Edit `.env.local`:

- For a **UI-only** pass, you can leave integrations empty; newsletter and
  analytics routes will degrade gracefully.
- For **newsletter + MailPoet**, set `MAILPOET_API_BASE_URL` and
  `MAILPOET_API_KEY` (see `env/site.integrations.example`).
- For **analytics**, copy keys from `env/analytics.example` into `.env.local`
  and run migrations (section 2).

```bash
npm run dev
```

You should see the Next.js dev server start and compile without errors.

Visit [http://localhost:3000](http://localhost:3000). You should see the TX*Spark
home page with hero and content sections.

**If the dev server fails:**

- `EADDRINUSE` — another process on port 3000; stop it or use
  `npm run dev -- -p 3001`.
- Module not found — run `npm install` again from repo root.
- Type errors after pulling — run `npm run build` to surface full diagnostics.

### Optional: local WordPress

```bash
npm run cms:up
```

Open [http://localhost:8080](http://localhost:8080), complete the WordPress
installer, install MailPoet/WooCommerce plugins as needed, then point
`WORDPRESS_API_URL` and `MAILPOET_API_BASE_URL` at `http://localhost:8080` in
`.env.local` (tunnel or staging URL if the Next app cannot reach Docker
localhost from your network setup).

Stop CMS containers:

```bash
npm run cms:down
```

## 2. Analytics database (optional)

1. Create a Neon project (or branch) and copy the connection string.
2. Add to `.env.local`:

   ```
   ANALYTICS_DATABASE_URL=postgresql://...
   ```

3. Apply migrations:

   ```bash
   npm run analytics:migrate
   ```

4. Confirm tables exist: `analytics.newsletter_signup_events`,
   `analytics.commerce_orders`, `analytics.webhook_deliveries`.

See [`db/README.md`](../db/README.md) for schema notes.

## 3. Run the tests

```bash
npm test
```

Vitest runs co-located `*.test.ts` files (for example under
`src/lib/integrations/` and `src/lib/analytics/`). Expect a few seconds on a
warm machine.

```bash
npm run lint
```

Fix any ESLint issues before opening a PR.

## 4. Make a trivial change

1. Open `src/components/nav-config.ts`.
2. In `DESKTOP_NAV`, confirm the **Events** link points to `/events`.
3. Save — hot reload should update the header.
4. Visit [http://localhost:3000](http://localhost:3000) and confirm **Events**
   appears in the desktop nav.
5. Revert or keep the change on a feature branch.

**Map work:** use the `map-migration/` tree and its docs; do not assume every
map script in old READMEs exists on `main` until that merge lands.

## 5. Where to look next

| Working on… | Start in… |
| --- | --- |
| Marketing pages | `src/app/`, `src/components/` |
| GROW toolkits | `src/data/grow-toolkits.ts`, `src/app/grow/` |
| Navigation | `src/components/nav-config.ts` |
| Newsletter API | `src/app/api/newsletter/`, `src/lib/newsletter-subscribe.ts` |
| WordPress / MailPoet / WooCommerce | `src/lib/integrations/` |
| Analytics events | `src/lib/analytics/`, `db/migrations/analytics/` |
| Auth / sessions | `src/lib/auth/`, `src/app/api/auth/` |
| Map (WIP) | `map-migration/src/`, `map-migration/docs/` |
| Hosting CMS | `infra/hosting/`, `wordpress/` |

Read [`docs/architecture.md`](architecture.md) for the full picture.

## 6. Conventions and gotchas

- **Imports:** use `@/` aliases; follow layer rules in
  `standards/99-project-overrides.md`.
- **Commits:** imperative subject ≤72 chars; Conventional Commits encouraged
  (`feat:`, `fix:`, `docs:`). See [`CONTRIBUTING.md`](../CONTRIBUTING.md).
- **Secrets:** only `env/*.example` is committed; never commit `.env.local`.
- **Generated data:** `src/data/generated/**` is script output — do not hand-edit.
- **Map migration:** `map-migration/` is a parallel copy of the map stack;
  avoid duplicating fixes in both trees without a plan.
- **AI tooling:** project may use private coding-standards symlinks; do not
  commit `CLAUDE.md`, `.cursor/`, or AI attribution in PRs
  (`standards/09-private-ai-use.md`).

## 7. Who to ask

Use your team's usual channels (Slack, Mattermost, GitHub Discussions). For
access: Vercel project env (`npm run env:pull`), Neon console, and WordPress
staging credentials.

## Done?

Open a PR that fixes anything outdated in this doc — that is a welcome first
contribution.
