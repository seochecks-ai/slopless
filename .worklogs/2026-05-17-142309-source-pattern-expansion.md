# Summary

Implemented source-derived Slopless pattern expansion across phrase, narrative, and academic families without accepting new fixture3 golden output.

The work adds wordiness, redundancy, narrative cliche, and academic tortured-phrase rules; expands cliche, corporate-speak, and LLM leakage matching; adds derived source notes; and expands cases/corpus coverage for every new active wordiness and redundancy phrase.

# Decisions Made

- Did not create `assistant-artifacts`; assistant leakage expanded through existing `llm-disclaimer` and `response-wrapper` ownership.
- Added `narrative-slop` and `academic-slop` as separate families because their false-positive profiles are domain-specific.
- Used reviewed token-template slots instead of a runtime POS dictionary.
- Removed overlapping cliche phrases from `corporate-speak` so `at the end of the day`, `back to the drawing board`, and `par for the course` belong to cliches only.
- Tightened the shared phrase matcher to treat unmatched opening quotes as quoted spans.
- Added a manifest verifier and `scripts/verify-all.sh`; fixture3 golden acceptance remains blocked until reviewed output is accepted in a later step.

# Key Files For Context

- `.plans/2026-05-17-134353-source-pattern-expansion-plan.md.manifest.toml`
- `scripts/verify-source-pattern-expansion.py`
- `scripts/verify-all.sh`
- `src/shared/matchers/phrases.ts`
- `src/families/phrases/wordiness.ts`
- `src/families/phrases/redundancy.ts`
- `src/families/narrative-slop/narrative-cliches.ts`
- `src/families/academic-slop/tortured-phrases.ts`
- `behavior/fixtures/textlint-rules/cases/phrases/hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/hits.md`
- `behavior/fixtures/textlint-rules/cases/academic-slop/hits.md`
- `.fixture3/textlint-rules/received.normalized.json`

# Verification

- `npm run validate`
- `scripts/behavior-replay.sh > .fixture3/textlint-rules/received.raw.json`
- `scripts/normalize-textlint-golden-output.py < .fixture3/textlint-rules/received.raw.json > .fixture3/textlint-rules/received.normalized.json`
- `scripts/verify-all.sh`
- Adversarial review SPX-D found no blocking findings after fixes.

# Next Steps

- Review `.fixture3/textlint-rules/received.normalized.json` as the candidate golden output.
- Accept fixture3 output only after explicit approval.
