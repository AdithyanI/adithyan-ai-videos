#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[check:full] running repo doctor"
node scripts/doctor.mjs

echo "[check:full] verifying Remotion compositions compile"
node scripts/check_compositions.mjs >/dev/null

echo "[check:full] passed"
