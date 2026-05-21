# TX*Spark

Grassroots civic-tech for Texans — interactive district maps, organizing
toolkits, and community resources. Built with Next.js, Mapbox, Kysely, and
offline map-data pipelines.

## Quick start

```bash
npm install
npm run env:pull    # optional: pull Vercel env into .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project layout

```
spark/
├── src/
│   ├── app/           # Next.js routes & API handlers (keep thin)
│   ├── components/    # UI — site chrome + map shell
│   ├── data/          # layer config, rosters, generated sync output
│   ├── emails/        # react-email templates
│   ├── hooks/         # React hooks (map, lookup)
│   ├── lib/           # auth, map logic, integrations (Kysely, R2, Resend)
│   └── types/         # shared TypeScript types
├── public/data/       # GeoJSON built by scripts (also published to R2)
├── scripts/           # map layer builds, roster sync, R2 snapshot
├── docs/              # feature docs (e.g. map mode matrix)
├── env/               # committed env templates (copy into .env.local)
└── standards/         # coding standards + 99-project-overrides.md
```

Authoritative structure rules: [`standards/99-project-overrides.md`](standards/99-project-overrides.md).

### Common scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Next.js dev server |
| `npm run map:build:travis-merged-layers` | Rebuild all Travis map GeoJSON |
| `npm run sync:legislators` | Refresh legislator rosters into `src/data/generated/` |
| `npm run check:map-upstreams` | Verify external layer URLs |
| `npm run snapshot:map-geojson:r2` | Upload `public/data/` to R2 |
