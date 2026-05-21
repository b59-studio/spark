#!/usr/bin/env bash
# run.sh — friendly wrapper around `promptfoo eval`.
#
# Usage:
#   bash evals/run.sh                   # run the full suite
#   bash evals/run.sh <agent>           # run cases for one agent
#   bash evals/run.sh <agent> --repeat 3   # repeat each case 3 times (flake check)
#   bash evals/run.sh --quick           # just the existing core 3 cases (fast)
#
# Expects: promptfoo on PATH (npm install -g promptfoo), and
# ANTHROPIC_API_KEY in your env.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Preflight
if ! command -v promptfoo >/dev/null 2>&1; then
  echo "ERROR: promptfoo not found. Install: npm install -g promptfoo" >&2
  exit 1
fi
if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  echo "ERROR: ANTHROPIC_API_KEY not set." >&2
  echo "  export ANTHROPIC_API_KEY=sk-ant-..." >&2
  exit 1
fi

# Parse args
agent=""
extra_args=()
for arg in "$@"; do
  case "$arg" in
    --quick)
      agent="code-quality-reviewer docs-reviewer naming-reviewer"
      ;;
    --repeat|--max-concurrency|-*)
      extra_args+=("$arg")
      ;;
    *)
      [[ -z "$agent" ]] && agent="$arg" || extra_args+=("$arg")
      ;;
  esac
done

# Build the test list
tests=()
if [[ -z "$agent" ]]; then
  while IFS= read -r f; do tests+=("$f"); done < <(find cases -name '*.yaml' | sort)
else
  for a in $agent; do
    while IFS= read -r f; do tests+=("$f"); done < <(find "cases/$a" -name '*.yaml' 2>/dev/null | sort)
  done
fi

if [[ ${#tests[@]} -eq 0 ]]; then
  echo "No cases matched." >&2
  exit 1
fi

echo "Running ${#tests[@]} case(s):"
printf "  - %s\n" "${tests[@]}"
echo ""

# Write a temporary config that lists exactly these tests
tmp_config=$(mktemp -t promptfoo_run_XXXXXX.yaml)
trap 'rm -f "$tmp_config"' EXIT

{
  sed '/^tests:/,$d' promptfooconfig.yaml
  echo "tests:"
  for t in "${tests[@]}"; do
    echo "  - $t"
  done
} > "$tmp_config"

mkdir -p results
promptfoo eval --config "$tmp_config" "${extra_args[@]}"

echo ""
echo "Done. Latest results: $(ls -t results/*.json 2>/dev/null | head -1 || echo '(no JSON written)')"
echo "View with:  promptfoo view"
