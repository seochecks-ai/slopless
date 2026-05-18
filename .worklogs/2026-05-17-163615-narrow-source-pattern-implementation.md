# Summary

Implemented the narrow source-derived patterns that had enough local context to be safe: exact academic tortured phrases, exact wordiness phrases, exact redundancy phrases, one corporate abstraction frame, and paragraph-start response wrappers.

Fixture cases, corpus prose, preserve metadata, approved fixture output, and source-material records were updated in the same change.

# Decisions Made

- Added only exact phrases and one narrow template because these items have clear bad-writing signals without broad semantic inference.
- Kept `continue on` unimplemented because it has common clean uses such as UI instructions and dates.
- Limited `important to note` and `worth noting` to paragraph-start matching so quoted or mid-sentence technical references do not report.
- Removed implemented items from `legacy/source-material/derived` and recorded them in `legacy/source-material/incorporation-record.md`.

# Key Files For Context

- `.plans/2026-05-17-162048-narrow-source-pattern-implementation.md`
- `src/families/academic-slop/data/tortured-phrases.json`
- `src/families/phrases/data/wordiness-patterns.json`
- `src/families/phrases/data/redundancy-patterns.json`
- `src/families/phrases/data/corporate-abstraction-patterns.json`
- `src/families/syntactic-patterns/llm-artifacts/data/response-wrapper-patterns.json`
- `src/families/syntactic-patterns/llm-artifacts/response-wrapper.ts`
- `behavior/fixtures/textlint-rules/cases`
- `behavior/fixtures/textlint-rules/corpus`
- `behavior/golden/textlint-rules/approved.normalized.json`

# Verification

- no-hit scanner: `no_hit_message_count=0`
- `scripts/fixture3.sh check --suite textlint-rules`: `status: matched`
- `scripts/verify-all.sh`
- `npm run validate`

# Next Steps

- Continue implementing only source-derived items that can be expressed with narrow fixtures and clean no-hit controls.
