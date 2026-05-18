# Summary

Expanded existing LLM artifact detection without creating a new rule family.

The change moves chat-scaffold phrases out of `llm-disclaimer` ownership and into the existing `response-wrapper` rule, while keeping `llm-disclaimer` focused on assistant identity and knowledge-limit disclaimers.

# Decisions Made

- Did not create a new `llm-artifacts` family because it already exists under syntactic patterns.
- Added `response-wrapper-patterns.json` for source-derived chat scaffold frames.
- Kept broad LLM vocabulary lists out of direct response-wrapper matching.
- Excluded broad `worth noting` and bare `deeper into a specific aspect` patterns because they are too likely to catch normal prose.
- Added hit and no-hit cases plus corpus preserve entries for the reviewed scaffold patterns.
- Did not accept fixture3 output.

# Key Files For Context

- `.plans/2026-05-17-150834-llm-artifact-expansion.md`
- `src/families/syntactic-patterns/llm-artifacts/response-wrapper.ts`
- `src/families/syntactic-patterns/llm-artifacts/data/response-wrapper-patterns.json`
- `src/families/phrases/data/llm-disclaimer-expansions.json`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/engineering-review.md`
- `legacy/source-material/incorporation-record.md`

# Verification

- `npm run validate`
- `scripts/behavior-replay.sh > .fixture3/textlint-rules/received.raw.json`
- `scripts/normalize-textlint-golden-output.py < .fixture3/textlint-rules/received.raw.json > .fixture3/textlint-rules/received.normalized.json`
- `scripts/verify-all.sh`
- target no-hit scan returned `target_no_hit_count=0`

# Next Steps

- Review the regenerated received fixture output before accepting fixture3 changes.
