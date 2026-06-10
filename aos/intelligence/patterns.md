# Patterns

> Reusable approaches that have worked. Before solving a problem, check here. Before ending a session, ask: did I find something reusable? If yes, add it here.

---

## Template

```
## [Pattern name]

**Use when:** [The situation that calls for this pattern]

**Approach:** [How to implement it — specific enough to follow]

**Benefits:** [Why this works]

**Tradeoffs:** [What it costs or when it breaks down]
```

---

<!-- Add entries above this line -->

## Test-first agent authoring

**Use when:** Adding a new specialist agent to the system.

**Approach:** Write ≥3 eval cases *before* writing the agent prompt. Each case defines a real input and concrete assertions (including at least one negative: "does NOT do X"). Then write the prompt to make those cases pass. Register and route only after the cases are green.

**Benefits:** Cases define the contract before the implementation, not after. Prevents retrofitted tests that confirm what you built rather than what you meant to build. Forces the job to be well-defined before any code is written — if you can't write three cases, the spec isn't clear enough.

**Tradeoffs:** Adds a step before implementation. Teams under time pressure are tempted to skip it and "add evals later." Later never comes. The gate must be treated as a blocker, not a suggestion.
