---
name: omni-flash-video
description: Plan, prompt, and review Gemini Omni Flash / Google Flow video generations, especially reference-image or short stitched video sequences. Use when preparing Omni Flash prompts, choosing Flow settings, designing start/end frame workflows, splitting a story into short clips, building portal/door style transitions, or evaluating Omni/Flow outputs for continuity and next-step prompting.
---

# Omni Flash Video

## Overview

Use this skill to turn a video idea plus reference media into a practical Gemini
Omni Flash / Google Flow generation plan. Prefer short, atomic clips and clear
reference roles over one overloaded prompt.

## Default Workflow

1. Identify the generation mode:
   - **Frames to Video** for a still image that should animate.
   - **Ingredients/References to Video** when preserving a character, object,
     style, voice, or environment across clips.
   - **Video to Video editing** when editing an uploaded/generated clip.
   - **Storyboard / multi-shot** when a sequence needs several generated clips.
2. Assign each input a role before prompting:
   - start frame
   - end frame
   - character/identity reference
   - style reference
   - destination/environment reference
   - prior-shot continuity reference
3. Write one prompt per clip. Keep each clip to one main action, one camera
   behavior, and one transition intent.
4. Generate one or more canaries in Flow. Review for first-frame match,
   action readability, last-frame usability, and continuity.
5. If a clip is close, iterate conversationally in Flow with specific edits.
   If the composition is wrong, revise the prompt/reference setup and regenerate.
6. Save prompts, reference paths, generated outputs, and review notes in the
   project folder.

## Read References

- Read `references/official-research.md` when you need current access paths,
  supported Flow features, durations, limits, or source links.
- Read `references/prompt-playbook.md` before writing prompts, especially for
  image-to-video, start/end frames, or door/portal transitions.
- Read `references/paper-portal.md` when working on the sketch-to-door project.

## Prompt Rules

- Prompt motion from the reference rather than re-describing every visible
  detail in the image.
- Use positive instructions: `static camera`, `locked-off shot`, `clean pencil
  sketch animation`, `one continuous shot`.
- Keep style changes at transition points. Doorways/portals are useful reset
  points for model consistency.
- Use short clip durations for controllability. Treat 4-10 seconds as a clip
  unit, not a whole story.
- Avoid asking for several story beats in one generation. Split them.
- Use negative notes sparingly and as nouns/qualities: `extra limbs, extra
  characters, colored background, clutter, text`.

## Output Checklist

For each generated clip, record:

- Flow mode and model
- source frame/reference files
- prompt text
- duration and aspect ratio
- output file or URL
- what worked
- what failed
- whether the last frame is usable as the next seed

