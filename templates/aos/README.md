# AOS Templates

Six files that bootstrap organizational memory in any new project.

## Deployment

When initializing a new project, copy this directory to the project root:

```
cp -r templates/aos/ /path/to/new-project/aos/
```

Then:
1. Fill in `aos/summaries/project_summary.md` with the project's purpose and architecture
2. Set the first sprint goal in `aos/execution/current_sprint.md`
3. Leave the other four files empty — they fill themselves as the project runs

## File Map

```
aos/
  execution/
    active_task.md       ← updated every session (hot)
    current_sprint.md    ← updated weekly (hot)
  project/
    decisions.md         ← updated on significant decisions (warm)
  summaries/
    project_summary.md   ← updated when the project materially changes (warm)
  intelligence/
    lessons_learned.md   ← updated when something surprises an agent (warm)
    patterns.md          ← updated when a reusable solution is found (warm)
```

## Agent Startup Procedure

Add to the project's `CLAUDE.md`:

```markdown
## Session startup (read first, every session)

1. `aos/summaries/project_summary.md` — what this project is
2. `aos/execution/current_sprint.md` — what we're doing now
3. `aos/execution/active_task.md` — what the last agent was doing

## Session shutdown (before ending any session with meaningful work)

- `aos/execution/active_task.md` — update status + next action
- `aos/project/decisions.md` — record any significant decision
- `aos/intelligence/lessons_learned.md` — record anything that surprised you
- `aos/intelligence/patterns.md` — record any reusable solution
```


## Full project docs structure

When deploying AOS, also establish this `docs/` structure alongside it. Agents must not create `.md` files at the repo root — everything routes here:

```
docs/
  adr/              ← Architecture decision records
  reports/          ← Audit results, completion reports (YYYY-MM-DD-title.md)
  runbooks/         ← Operational procedures
  specs/            ← Feature specs, PRDs
  agents/           ← Agent-specific onboarding and reference docs
  onboarding.md     ← New developer guide
  architecture.md   ← System overview
```

### File type → location

| Agent produces... | Goes to |
|---|---|
| Next steps, in-flight task state | `aos/execution/active_task.md` |
| Significant decision | `aos/project/decisions.md` |
| Audit or completion report | `docs/reports/YYYY-MM-DD-title.md` |
| Agent onboarding or reference doc | `docs/agents/<name>.md` |
| Architecture decision record | `docs/adr/` |
| Feature spec / PRD | `docs/specs/` |
| Lessons from completed work | `aos/intelligence/lessons_learned.md` |
| Reusable pattern | `aos/intelligence/patterns.md` |

## What Not to Do

- Don't fill all six files on day one with hypothetical content
- Don't create `metrics/`, `postmortems/`, or other AOS directories until the six core files are being maintained consistently
- Don't treat this as documentation — treat it as a live operational system
