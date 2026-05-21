# ADR 0004: Map stack in `map-migration/` worktree until merge

**Status:** Accepted  
**Date:** 2026-05-20

## Context

TX*SPARK ships two map products: a public **district explorer** and an
authenticated **household spark** map. The codebase accumulated Mapbox,
PostGIS, Prisma, ETL scripts, R2 GeoJSON publishing, and large `src/` map
trees. The marketing site on `main` is moving toward WordPress + analytics
while map boundaries, modes, and auth are still in flux.

We need to continue map development without blocking marketing releases or
rewriting README/scripts for a stack that is not yet the default on `main`.

## Decision

Keep active map development in a parallel tree **`map-migration/`** (full
copy of map-related app, prisma, scripts, workflows, and docs). The root
`README` and architecture docs describe the **marketing + integrations**
system; map details live in `map-migration/docs/` (e.g. map mode matrix).

Do **not** split `DistrictMap` / `SparkMap` components on `main` until the
destination architecture is chosen (single app vs separate service vs embed).

## Consequences

**Positive**

- Marketing contributors are not required to install Mapbox, PostGIS, or ETL
  tooling.
- Clear signal in docs that map scripts in old READMEs may not apply to `main`.

**Negative**

- Risk of drift between `src/` map files and `map-migration/src/`.
- Duplicated CI/workflows until merge.
- Confusion for newcomers unless they read ADR 0004 and `docs/architecture.md`.

**Follow-ups**

- Decide: merged monorepo (`src/features/district-map`), separate deployable,
  or organizer-only host — then supersede this ADR with a merge plan.
- When merging, update root `package.json` scripts, README, and remove duplicate
  tree in one coordinated PR.
