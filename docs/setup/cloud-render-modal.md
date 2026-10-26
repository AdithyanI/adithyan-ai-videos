# Cloud Render (Modal)

## Setup and command

With Python 3.11–3.14 installed (`3.13` recommended), run:

```bash
npm run setup:cloud
npm run render:cloud -- --comp PaperPortal
```

Setup recreates this repository's disposable, ignored `.venv`, installs the pinned client and
transitive dependencies from `requirements-cloud.txt`, and checks the installation.
Rerun it after changing the dependency pins or replacing the machine's Python.
It is safe to rerun; local rendering and `npm install` do not require this setup.

The launcher always uses `.venv` with Python's isolated mode, so another
environment's `PYTHONPATH` cannot supply its packages. It resolves paths from the
script's location. Neither a sibling AI Podcasting checkout nor a globally installed Modal
package is needed. Existing machine Modal authentication is reused; setup does
not create or copy credentials. On an unenrolled machine, follow the shared
credential setup before submitting a render.

## Preconditions

- Working tree is clean and pushed (cloud render resolves by git SHA).
- Modal auth and required secrets are configured.
- AI Podcasting still owns the deployed `aip-processor / render_remotion_cloud` service.
  This repository owns only its local client environment; no backend deployment
  is needed for client setup.
- Pass an enabled composition from `src/projects/registry.js` with `--comp`.
  Cloud rendering defaults to HQ; use `--preview` for the preview preset. See
  `npm run render:cloud -- --help` for optional controls.
- The target composition must not depend on ignored local runtime media.
  Active cloud-safe projects should keep runtime assets in `assets.js` as
  remote URLs.
- If a beat currently depends on a local frame sequence for cutout quality,
  convert it into one uploaded transparent runtime asset before relying on full
  cloud render.

## Notes

- Use local preview slices before cloud HQ renders.
- Keep cloud renders for stable checkpoints, not tight iteration.
- `npm run render:cloud` invokes the deployed Modal function directly via
  `modal.Function.from_name(...)` and records the call on the persistent app.
- The repo cloud wrapper waits internally and emits heartbeat status lines
  while the render is running. The command returns the final URL when the cloud
  render completes.
- Cloud renders default to lifecycle-managed `cache/`. Pass
  `--storage-prefix share` or `--storage-prefix permanent` only when a
  deliberately longer-lived public render is required.
- Remote render inputs are reused through Modal's
  `/cache/win-remotion-assets` working cache. Cache hits refresh their age, and
  the shared daily Modal cleanup removes inputs unused for 72 hours. Missing
  inputs are downloaded again automatically on the next render.
- CPU, memory and automatic concurrency are owned by the deployed backend.
  Inspect that configuration before tuning; old composition benchmarks are not
  a contract for the current worker. The recorded user preference is a 32-CPU
  worker; backend tuning is separate from this client setup.
