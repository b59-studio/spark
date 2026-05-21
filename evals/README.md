# Evals

This folder is the testing infrastructure for the subagents
themselves. Every prompt edit should run the eval suite; CI should
gate prompt changes on it.

## Framework

[Promptfoo](https://www.promptfoo.dev/). Reasons:
- Lightweight (single npm package).
- YAML test definitions; easy to diff and review.
- Built-in graders (exact match, regex, contains, LLM-as-judge).
- CI-friendly output (JSON, JUnit XML).

## Layout

```
evals/
├── README.md                       ← you are here
├── promptfooconfig.yaml            ← top-level Promptfoo config
├── cases/
│   ├── code-quality-reviewer/      ← one folder per subagent
│   │   ├── 01-missing-tests.yaml
│   │   ├── 02-bad-naming.yaml
│   │   └── ...
│   ├── docs-reviewer/
│   └── ...
├── fixtures/                       ← sample code/diff snippets the cases reference
│   ├── code-bad-naming.py
│   └── diff-missing-tests.patch
└── results/                        ← gitignored; output from each run
```

## Running

A `run.sh` helper wraps `promptfoo` with friendlier defaults:

```bash
# install once
npm install -g promptfoo
export ANTHROPIC_API_KEY=sk-ant-...

# run the whole suite (all 20 cases)
bash evals/run.sh

# run cases for one agent
bash evals/run.sh code-quality-reviewer

# multiple agents at once
bash evals/run.sh code-quality-reviewer security-tester

# repeat each case 3 times to check for flakes
bash evals/run.sh code-quality-reviewer --repeat 3

# the original 3 fast cases (no API key burn for smoke testing)
bash evals/run.sh --quick

# see the last run interactively
promptfoo view
```

## Phase 2 status

One eval case exists per subagent (20 cases). The discipline doc
says ≥3 per agent; we deliberately launched at 1 each as a baseline.

**To grow the suite (ongoing):**

- When an agent misses something in real work, add that input as a
  case immediately. That's where high-leverage coverage comes from.
- When an agent over-fires (false positive), add a case asserting it
  does NOT flag the benign input.
- Aim for 3 per agent within a quarter of use. No need to rush —
  real failures are better than synthetic ones.

## Adding a case

When you edit a subagent's prompt, add at least one case that:
1. Captures a real input you saw it handle correctly.
2. Asserts on the *shape* and *content* of the output (not exact
   wording — that's brittle).
3. Lives under `cases/<agent-name>/NN-<short-desc>.yaml`.

Bias toward cases that came from *real* problems — bugs the agent
should catch, naming issues you encountered, real PRs that broke a
rule. Synthetic cases drift from reality fast.

## What good asserts look like

```yaml
assert:
  # Must mention the missing test for the new public function
  - type: contains
    value: "missing test"

  # Severity classification present
  - type: regex
    value: "(Blocker|Should fix|Nit)"

  # LLM-as-judge for nuanced criteria
  - type: llm-rubric
    value: |
      The response correctly identifies that the new function
      `parseInvoice` lacks unit-test coverage. The response does
      NOT recommend deleting the function or adding `@skip`.
```

## CI integration

The intent is that any change to `.claude/agents/*.md` triggers a
fresh eval run. Recommended GitHub Actions snippet (when you
move this to a real repo):

```yaml
- name: Run eval suite
  run: |
    npm install -g promptfoo
    cd evals && promptfoo eval --output results/ci.json
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

Fail the build on any regression. Treat the suite the way you'd
treat a unit test suite — flakes get fixed, not ignored.

## Standards

See `standards/14-evals.md` for the discipline: when to add cases,
how to write asserts that don't drift, how to handle non-determinism.
