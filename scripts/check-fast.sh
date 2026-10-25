#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

mapfile -t staged_files < <(git diff --cached --name-only --diff-filter=ACMR)

if [ "${#staged_files[@]}" -eq 0 ]; then
  echo "[check:fast] no staged files; skipping checks"
  exit 0
fi

echo "[check:fast] checking for merge conflict markers"
if command -v rg >/dev/null 2>&1; then
  if rg -n --no-messages "^(<<<<<<< |=======|>>>>>>> )" -- "${staged_files[@]}"; then
    echo "[check:fast] merge conflict markers detected"
    exit 1
  fi
else
  if grep -nE "^(<<<<<<< |=======|>>>>>>> )" "${staged_files[@]}"; then
    echo "[check:fast] merge conflict markers detected"
    exit 1
  fi
fi

json_failed=0
for file in "${staged_files[@]}"; do
  if [[ "$file" == *.json ]] && [ -f "$file" ]; then
    node -e "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8'))" "$file" || json_failed=1
  fi
done

if [ "$json_failed" -ne 0 ]; then
  echo "[check:fast] invalid JSON detected"
  exit 1
fi

needs_video_checks=0
for file in "${staged_files[@]}"; do
  case "$file" in
    package.json|package-lock.json|src/*|scripts/*|projects/*)
      needs_video_checks=1
      ;;
  esac
done

if [ "$needs_video_checks" -eq 0 ]; then
  echo "[check:fast] no staged video/runtime files; skipping video checks"
  echo "[check:fast] passed"
  exit 0
fi

echo "[check:fast] running repo doctor"
node scripts/doctor.mjs

echo "[check:fast] verifying Remotion compositions compile"
node scripts/check_compositions.mjs >/dev/null

echo "[check:fast] passed"
