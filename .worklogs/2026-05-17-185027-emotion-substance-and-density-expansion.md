# Emotion Substance And Density Expansion

## Summary

Added generalized Sunstone slop coverage for emotion-as-substance, summary-fog transitions, body-action density, and flat action cadence. Generated large source-material variant notes, added case and corpus fixtures, approved fixture3 output, and strengthened manifest verification so required hits and no-hits are checked against approved output.

## Decisions Made

- Added `emotion-as-substance` as a semantic-thinness template with emotion/state slots treated as physical substance motion.
- Added `summary-fog-transition` for lines that replace event sequence with blur, haze, or fog.
- Expanded body-action density with multi-word event cues, then fixed overlap counting so `ears flattened` and similar phrases count as one event, not phrase plus head token.
- Expanded flat-action cadence, then removed `rest` and `melted` from weak-action verbs because adversarial review showed noun and semantic-emotion false positives.
- Kept generated variants in `legacy/source-material/derived` as source material, while moving implemented source examples out of the not-implemented Sunstone source file.
- Added verifier checks for semantic pattern attribution, narrative rule attribution, no-hit silence, source-material state, corpus preservation, and fixture3 approved output.

## Key Files For Context

- `.plans/2026-05-17-181310-emotion-substance-and-density-expansion.md`
- `.plans/2026-05-17-181310-emotion-substance-and-density-expansion.md.manifest.toml`
- `scripts/verify-emotion-substance-and-density-expansion.py`
- `scripts/verify-source-material.py`
- `src/families/semantic-thinness/patterns/emotion-as-substance.json`
- `src/families/semantic-thinness/patterns/summary-fog-transition.json`
- `src/families/narrative-slop/body-action-density.ts`
- `src/families/narrative-slop/flat-action-cadence.ts`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/narrative-scenes.md`
- `behavior/golden/textlint-rules/approved.normalized.json`
- `legacy/source-material/incorporation-record.md`
- `legacy/source-material/derived/sunstone-emotion-substance-variants.md`
- `legacy/source-material/derived/sunstone-action-density-variants.md`

## Verification

- `scripts/fixture3.sh check --suite textlint-rules`: passed, status matched.
- `scripts/verify-all.sh`: passed.
- `scripts/verify-emotion-substance-and-density-expansion.py`: passed.
- `npm run validate`: passed.
- Final adversarial convergence review: no concrete gaps found.

## Next Steps

- Continue adding generalized source-derived patterns only when the source examples can be moved from not implemented to implemented with case hits, no-hit controls, corpus preservation, and approved output attribution.
