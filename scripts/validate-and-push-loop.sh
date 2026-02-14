#!/usr/bin/env bash
# Validate-and-push loop: pull, lint, fix, validate, push. Runs for ~1 hour.
# Usage: ./scripts/validate-and-push-loop.sh

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
BRANCH="$(git branch --show-current)"
END_TIME=$(($(date +%s) + 3600))  # 1 hour from now

cycle() {
  echo "=== Cycle at $(date) ==="
  git fetch origin 2>/dev/null || true
  git pull origin "$BRANCH" 2>/dev/null || true

  npm run lint || { echo "Lint failed"; return 1; }

  if ! npm run build >/dev/null 2>&1; then
    echo "Build failed"
    return 1
  fi

  # Validate skills
  for f in skills/*.md; do
    [ -f "$f" ] || continue
    [ "$(wc -c < "$f")" -ge 100 ] || { echo "Skill $(basename "$f") too short"; return 1; }
  done

  if [[ -n $(git status -s) ]]; then
    git add -A && git commit -m "fix: lint and validation polish" && git push origin "$BRANCH"
    echo "Pushed changes"
  else
    echo "No changes to push"
  fi
  return 0
}

while [ "$(date +%s)" -lt "$END_TIME" ]; do
  cycle || true
  echo "Sleeping 5 min..."
  sleep 300
done
echo "Done (1 hour elapsed)"
