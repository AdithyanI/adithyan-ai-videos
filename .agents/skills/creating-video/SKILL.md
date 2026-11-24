---
name: creating-video
description: Creates or edits code-first Remotion videos in this repo, from a supplied recording or idea through beat planning, overlays, composition registration, and rendered visual proof.
---

# Creating Video

Start from the affected project and the user's intended deliverable. Use an
existing storyboard when supplied. Otherwise draft enough beats to implement;
an authorized end-to-end request does not require a separate storyboard approval.
Ask when a missing creative decision would materially change the result. Keep
new spending and publication within the user's authorized scope.

## Repo contracts

- Per-video implementation and runtime assets live in `src/projects/<project-id>/`.
  `npm run new:project -- --id <project-id> --title "My Video"` scaffolds it and
  source material under `projects/<project-id>/`, and updates `src/projects/registry.js`.
  Do not add project manifests or hand-wire compositions into `src/Root.js`.
- Keep transcript words/timestamps with the composition. Derive stable effect
  anchors once and store them in `assets.js`; avoid runtime phrase searches.
- `src/overlay_kit/` owns primitives, `src/effects/` owns repeated visual blocks,
  and each project owns its copy/timing. Keep one-off choreography local.
- Use named `<Sequence>` blocks for major beats. Extra video layers must be muted
  and aligned to the source timeline; Sequence-local frames are not absolute time.
- For cloud delivery, runtime inputs must be reachable from cloud. Preserve local
  source media separately; an asset URL must have the retention needed by the
  composition. See `docs/references/media-storage.md` before promoting media.
- Use the `media-toolkit` skill when it covers a needed transcription/transform/matting
  operation. Use the installed `remotion` skill for unfamiliar Remotion APIs.

## Read only for the affected work

- Source/timing gaps and proxies: `references/intake.md`.
- Beat format: `references/storyboard.md`; timing: `references/timeline-patterns.md`.
- Visual language: `references/style-tokens.md`; existing primitives:
  `references/overlay-components.md`.
- Reuse boundaries: `references/effect-extraction.md` and
  `docs/references/effect-library.md`.
- Layer alignment, alpha edges, and render pitfalls: `references/verification.md`.
- Asset cache behavior: `references/asset-caching.md`.
- Prior production lessons: `references/lessons-learned.md`.

## Complete the deliverable

The command reference is `docs/references/repo-operations.md`; inspect command
help for flags. Use `docs/references/verification-loop.md` to inspect actual
rendered output. Verify shared effects in EffectsLab and an affected narrative
slice. Studio playback alone is insufficient. Cloud rendering is needed only
when cloud delivery is part of the task; use the repo client that waits for the
final URL. Keep temporary renders/stills under `tmp/` and active multi-session
state in `docs/projects/<project-id>/tasks.md`.
