# Source and Timing Intake

Resolve the viewer goal, source section, output format, and style from the
request and existing project. Ask only for missing decisions that block the
work. Transcribe only when the edit needs dialogue or timing that is not already
available. For an authorized end-to-end video, draft missing beats and continue
through implementation and rendered proof.

## When transcription is needed

First check the `media-toolkit` skill for media-processing work in this repo. It should usually be the default surface for transcription and other media jobs when it supports what you need.

Command:

```bash
cd <repo-root>
.agents/skills/media-toolkit/scripts/media_toolkit.sh transcribe --url "<video-url>" \
  --out projects/<project-id>/transcript.json
```

Notes:
- By default this emits a full JSON payload:
  - `source_id`
  - `text`
  - `words` (normalized word timings)
  - `sentences`
- For local source media, first check whether the `media-toolkit` skill supports the direct file path you have.
- For code-first Remotion projects, prefer committing a thin words-only artifact inside the project:
  - `src/projects/<project-id>/transcript_words.json` (usually copied from `transcript.json.words`)

Optional (convenience), generate thin derived artifacts:

```bash
cd <repo-root>
node scripts/extract_transcript_artifacts.mjs projects/<project-id>
```

Outputs:
- `projects/<project-id>/words.json`
- `projects/<project-id>/sentences.json`

## Proxies / Scaling (Optional)

If iteration is slow (matting, Studio playback, remote fetch), it’s ok to work off a smaller proxy video.

- First check the `media-toolkit` skill for transform support before reaching for lower-level backend internals.
- Persist the transform output JSON under the project folder (e.g. `projects/<project-id>/transform_720p.json`).
- While iterating, point your composition’s `VIDEO_URL` (usually in `src/projects/<project-id>/assets.js`) to the transform `output_url`.
- Keep the original source URL referenced in the transform JSON (`input_url`) for later “final” exports.

## Foreground Matting / Alpha (Optional)

If/when occlusion is needed, you want a **real alpha asset** (typically `alpha.webm` = VP9 + alpha).

Workflow:

- First check the `media-toolkit` skill for a matting path. If it does not cover the case, then drop lower into the backend-specific workflow.
- Paste the resulting `alpha.webm` URL into `src/projects/<project-id>/assets.js` (code-first).

Notes:

- We are intentionally not standardizing on `projects/<project-id>/matting.json` as a required artifact.
- If you keep any generated matte metadata, treat it as a scratch artifact, not a contract.
