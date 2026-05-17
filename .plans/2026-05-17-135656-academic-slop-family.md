# Goal

Implement the `academic-slop` family with `slopless/tortured-phrases`.

The rule reports narrow, source-derived tortured phrases without flagging normal scientific vocabulary.

# Approach

- Add `src/families/academic-slop/tortured-phrases.ts`.
- Add `src/families/academic-slop/data/tortured-phrases.json`.
- Use `findUnquotedPhraseMatches` so quoted example phrases are not reported.
- Ignore link text and link references, following phrase-family rules that avoid markup examples.
- Add `src/registries/academic-slop.ts` and export it through `src/index.ts`.
- Enable `tortured-phrases` in `src/presets/everything.ts`.
- Add the package export in `package.json`.
- Add `dist/families/academic-slop` to `scripts/behavior-replay.sh`.
- Add hit and no-hit case fixtures under `behavior/fixtures/textlint-rules/cases/academic-slop`.

# Key Decisions

- Use only exact phrases from the named source material: `sign to clamor`, `bosom peril`, and `counterfeit consciousness`.
- Reject broader templates around `consciousness`, `peril`, `sign`, or `clamor` because those would flag normal vocabulary.
- Treat quoted phrase examples as examples, not prose defects.

# Files To Modify

- `src/families/academic-slop/tortured-phrases.ts`
- `src/families/academic-slop/data/tortured-phrases.json`
- `src/registries/academic-slop.ts`
- `src/index.ts`
- `src/presets/everything.ts`
- `package.json`
- `scripts/behavior-replay.sh`
- `behavior/fixtures/textlint-rules/cases/academic-slop/hits.md`
- `behavior/fixtures/textlint-rules/cases/academic-slop/no-hits.md`
