# TX*Spark

Grassroots civic-tech for Texans — a Next.js marketing site, organizing
toolkits, and integrations with a headless WordPress CMS (MailPoet,
WooCommerce). Interactive district maps live in a separate migration
worktree under `map-migration/` until that stack is merged back.

## Quick start

**Prerequisites:** Node.js 20+, npm 11+

```bash
git clone https://github.com/b59-studio/spark.git
cd spark
npm install
cp env/site.integrations.example .env.local
# Optional: cp env/analytics.example .env.local and merge keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Pull Vercel env vars when you have project access:

```bash
npm run env:pull   # writes .env from Vercel
```

### Local WordPress CMS (optional)

```bash
npm run cms:up     # http://localhost:8080
npm run cms:down
```

Set `WORDPRESS_API_URL`, `MAILPOET_*`, and `WOOCOMMERCE_*` in `.env.local`
from `env/site.integrations.example`. See `wordpress/docker-compose.yml`.

### Analytics database (optional)

```bash
# Set ANALYTICS_DATABASE_URL in .env.local (Neon — see env/analytics.example)
npm run analytics:migrate
```

Details: [`db/README.md`](db/README.md).

## Common scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm run test` | Vitest unit tests |
| `npm run lint` | ESLint |
| `npm run cms:up` / `cms:down` | Local WordPress via Docker |
| `npm run analytics:migrate` | Apply `db/migrations/analytics/` to Neon |
| `npm run env:pull` | Pull Vercel environment into `.env` |

## Project layout

```
spark/
├── src/
│   ├── app/              # Next.js App Router routes & API handlers
│   ├── components/       # UI — site chrome, newsletter, map shell
│   ├── data/             # Static content (toolkits, generated rosters)
│   ├── emails/           # react-email templates
│   ├── hooks/            # React hooks
│   ├── lib/              # Auth, analytics, integrations, map helpers
│   └── types/            # Shared TypeScript types
├── db/migrations/        # SQL migrations (analytics schema)
├── env/                  # Committed env templates (no secrets)
├── infra/hosting/        # WordPress VPS templates (DO, Cloudways)
├── wordpress/            # Local WP docker-compose
├── map-migration/        # Map stack WIP (PostGIS, Mapbox, ETL) — not merged
├── public/               # Static assets
└── docs/                 # Architecture, onboarding, ADRs
```

Authoritative structure and import rules:
[`standards/99-project-overrides.md`](standards/99-project-overrides.md).

## Documentation

| Doc | Purpose |
| --- | --- |
| [`docs/architecture.md`](docs/architecture.md) | C4-style system overview |
| [`docs/onboarding.md`](docs/onboarding.md) | New contributor guide (~2 hours) |
| [`docs/adr/`](docs/adr/) | Architectural decision records |
| [`db/README.md`](db/README.md) | Analytics schema & migrations |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | PR and commit guidelines |
| [`CHANGELOG.md`](CHANGELOG.md) | Release history |

## What runs where

| Service | Typical host |
| ------- | ------------ |
| Next.js site | Vercel |
| WordPress + MailPoet + WooCommerce | VPS (DigitalOcean / Cloudways) — see `infra/hosting/` |
| Analytics Postgres | Neon (`analytics` schema) |
| Map app + PostGIS (WIP) | Neon — see `map-migration/` |

## License

See [LICENSE](LICENSE).
