# Cloud Render (Modal)

## Command

```bash
npm run render:cloud -- --comp ObjectSegmentation --hq
```

## Preconditions

- Working tree is clean and pushed (cloud render resolves by git SHA).
- Modal auth and required secrets are configured.
- The wrapper uses the sibling WIN checkout's `venv/bin/python` when present,
  otherwise `python3` must have the Modal SDK. WIN owns the `aip-processor`
  runtime under `modal_runtime/`; the app and function names are unchanged.
- The target composition must not depend on ignored local runtime media.
  Active cloud-safe projects should keep runtime assets in `assets.js` as
  remote URLs.
- If a beat currently depends on a local frame sequence for cutout quality,
  convert it into one uploaded transparent runtime asset before relying on full
  cloud render.

## Notes

- Use local preview slices before cloud HQ renders.
- Keep cloud renders for stable checkpoints, not tight iteration.
- `npm run render:cloud` now invokes the deployed `aip-processor` Modal app
  directly via `modal.Function.from_name(...)`. It no longer uses
  `modal run -d`, so cloud renders show up as function calls on the persistent
  deployed app instead of detached ephemeral apps.
- The repo cloud wrapper now waits internally and emits heartbeat status lines
  while the render is running. The command returns the final URL when the cloud
  render completes.
- Cloud renders default to lifecycle-managed `cache/`. Pass
  `--storage-prefix share` or `--storage-prefix permanent` only when a
  deliberately longer-lived public render is required.
- Remote render inputs are reused through Modal's
  `/cache/win-remotion-assets` working cache. Cache hits refresh their age, and
  the shared daily Modal cleanup removes inputs unused for 72 hours. Missing
  inputs are downloaded again automatically on the next render.
- Current backend tuning is calibrated against `ObjectSegmentation` on a representative
  `72s -> 88s` slice:
  - currently deployed worker reservation: `32` CPU cores, `65536` MB memory
  - default auto concurrency target: `28`
  - benchmark results:
    - `16x`: about `135.04s`
    - `20x`: about `122.72s`
    - `24x`: about `124.09s`
    - `28x`: about `113.00s`
    - `32x`: about `118.25s`
- A later fair comparison on the same pushed SHA showed that `64 CPU / 64 GiB /
  28x` was faster (`97s`) than `32 CPU / 64 GiB / 28x` (`106s`).
- The deployed app is currently kept at `32 CPU` by user preference, but if
  the priority shifts back to raw speed, move the worker reservation back to
  `64 CPU / 64 GiB` while keeping `28x` concurrency.
- Noisy “Detected differing memory amounts” lines come from Remotion inside the
  cloud container. They are useful to notice, but they were not the root cause
  of the earlier `ObjectSegmentation` failures. The real blocker was local-only runtime
  media in the composition path.
