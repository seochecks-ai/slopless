# Remaining Source Candidates

## Summary

Implemented the remaining usable redundancy, wordiness, and narrative source candidates. Redundancy and wordiness were added as exact unquoted phrase data; narrative breath, low-voice, and smile frames were added only as density-gated body cues.

## Decisions Made

- Added redundancy and wordiness candidates to existing phrase data instead of creating new rules because those rules already own exact phrase matching and quoted-example suppression.
- Added narrative candidates to `body-action-density` instead of `narrative-cliches` because those phrases are normal physical action in isolation.
- Kept the source candidate files present, but cleared the implemented candidate lists so `legacy/source-material/derived` only records what remains unimplemented.
- Accepted the fixture3 golden output after checking that new no-hit files produced no findings and the new received output contained the expected phrase and density findings.

## Key Files

- `src/rules/phrases/data/redundancy-patterns.json`
- `src/rules/phrases/data/wordiness-patterns.json`
- `src/rules/narrative-slop/body-action-density.ts`
- `behavior/fixtures/textlint-rules/cases/phrases/*.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/*.md`
- `behavior/fixtures/textlint-rules/corpus/editorial-style.md`
- `behavior/fixtures/textlint-rules/corpus/narrative-scenes.md`
- `behavior/golden/textlint-rules/approved.normalized.json`
- `legacy/source-material/incorporation-record.md`

## Verification

- `scripts/fixture3.sh check --suite textlint-rules`
- `scripts/verify-all.sh`
- `npm run validate`

## Next Steps

- Remaining source files still include academic, cliche-template, corporate-abstraction, and incomplete LLM-artifact candidates that were not part of this implementation.
