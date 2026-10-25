# Repo Operations

## Primary Commands

- `npm start`: start Remotion Studio through `scripts/studio_cached.mjs`.
- `npm run render`: render a preview of the first enabled composition from
  `src/projects/registry.js`.
- `npm run render -- --comp <CompositionId> --from 0 --to 6`: render a short
  preview slice for iteration.
- `npm run render -- --comp <CompositionId> --hq --out tmp/<CompositionId>-hq.mp4 --no-open`:
  render a local high-quality checkpoint.
- `npm run setup:cloud`: install the optional pinned Python client in this
  repository's `.venv`; see `docs/setup/cloud-render-modal.md` for prerequisites.
- `npm run render:cloud -- --comp <CompositionId>`: submit a production cloud
  render through the deployed Modal app and wait for the final URL.
- `npm run new:project -- --id <project-id> --title "My Video"`: scaffold both
  project folders and register the new composition.
- `npm run media:status`: inspect the local media storage state and folder
  sizes.
- `npm run media:check`: verify the managed local media link is usable when it
  exists.
- `npm run media:link -- --apply`: move `public/imports` to the configured
  media root and replace it with a symlink.
- `npm run media:setup`: agent-friendly alias for `npm run media:link -- --apply`.
- `npm run doctor`: verify repo shape and composition registration.
- `npm run check:fast`: run the staged-file guardrail used by the shared agent commit hook.

## Validation Contract

- The shared agent Git hook runs `scripts/check-fast.sh`.
- `check:fast` must stay fast and non-rendering.
- Current blocking checks:
  - merge conflict markers in staged files
  - invalid staged JSON
  - `npm run doctor`
  - `node scripts/check_compositions.mjs`
- Compilation uses a temporary empty public directory so checks do not traverse
  the external media library. Render verification still owns media availability;
  this check compiles source and evaluates composition metadata only.

## Execution Notes

- `npm start` and `npm run render -- ...` scan the active composition set from
  `src/projects/registry.js`, build a local asset cache for only those runtime
  assets, and pass cached props plus a staged public dir into Remotion.
- Local Remotion entrypoints prune stale temp dirs in `os.tmpdir()` before
  launch. Use `--no-temp-cleanup` to opt out, or
  `--temp-cleanup-age-hours <n>` to override the default `12h` TTL.
- `scripts/check-fast.sh` uses the same temp-cleaning wrapper for its
  compile check so repeated local guardrail runs do not accumulate stale
  Remotion bundles.
- For an active project that should render in cloud, keep runtime media in
  `src/projects/<id>/assets.js` as remote URLs. Local review still works because
  the cache downloads those assets once and reuses them.
- Treat local frame directories and scratch media as source material, not as
  long-term runtime dependencies. If a cutout/effect needs them for quality,
  prefer converting them into one uploaded transparent video and then pointing
  `assets.js` at that remote asset.
- Large local runtime imports belong under `public/imports/<project-id>/`.
  On the Mac Mini this path may be a symlink to
  `/Volumes/DobbyData/Videos/adithyan-ai-videos/public/imports`; use
  `npm run media:status` and `npm run media:check` to inspect it.
- `npm run render:cloud` owns the cloud wait loop. It prints the Modal call id,
  dashboard URL, heartbeat status lines, and the final output URL. Do not do
  separate manual polling unless you are debugging the backend itself.
- Use short local preview slices during iteration and reserve cloud or HQ
  renders for stable checkpoints.

## CI Policy

- This repo is local-first and currently relies on local guardrails instead of
  CI.
- Add minimal CI only if cross-machine drift, repeated local-only breakage, or
  a remote release gate becomes a real requirement.

## Related References

- `docs/references/verification-loop.md`
- `docs/references/media-storage.md`
- `docs/setup/cloud-render-modal.md`
