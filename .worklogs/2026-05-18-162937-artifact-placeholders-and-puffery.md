# Artifact Placeholders And Puffery

## Summary

Implemented the two agreed research areas: artifact placeholders and puffery/evaluative claim frames. Added manifests, deterministic verification, rule code, case fixtures, corpus coverage, accepted fixture3 output, and source bookkeeping.

## Decisions Made

- Added `orthography:artifact-placeholders` for generated residue and unfinished placeholder text because these are shipped text artifacts.
- Implemented puffery as `semantic-thinness` pattern data instead of a standalone phrase ban because isolated words such as `renowned` and `unprecedented` are too broad.
- Fixed `colon-dramatic` to skip known artifact-marker colons so `:contentReference[...]`, `[oaicite:N]`, and `sandbox:/...` do not generate duplicate colon findings.
- Suppressed nested `[oaicite:N]` matches inside `:contentReference[...]` so one artifact reports once.
- Removed both implemented areas from the active research queue and recorded them in the implemented archive.

## Key Files For Context

- `.plans/2026-05-18-161848-artifact-placeholders-and-puffery.md`
- `.plans/2026-05-18-161848-artifact-placeholders-and-puffery.md.manifest.toml`
- `scripts/verify-artifact-placeholders-and-puffery.py`
- `src/rules/orthography/artifact-placeholders.ts`
- `src/rules/orthography/colon-dramatic.ts`
- `src/rules/semantic-thinness/patterns/puffery-evaluative-claim.json`
- `behavior/fixtures/textlint-rules/cases/orthography/hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `legacy/source-material/expansion-2026-05-18/remaining-candidates.md`
- `legacy/source-material/expansion-2026-05-18/implemented/2026-05-18-artifact-placeholders-and-puffery.md`

## Verification

- `scripts/verify-all.sh` passed.
- `scripts/fixture3.sh check --suite textlint-rules` passed with `status: matched`.
- `npm run validate` passed.

## Next Steps

- Continue with `markdown-layout` artifact rules from `legacy/source-material/expansion-2026-05-18/remaining-candidates.md`.
