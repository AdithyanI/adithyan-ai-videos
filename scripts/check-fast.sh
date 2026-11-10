#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
exec "${REPO_FAST_CHECK:-$HOME/GitHub/scripts/bin/repo-fast-check}" \
  --scope staged --check-shell --check-python --check-json --no-input
