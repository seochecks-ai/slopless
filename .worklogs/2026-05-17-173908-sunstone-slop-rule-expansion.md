# Summary

Implemented the Sunstone slop rule expansion from a manifest and verifier.

The change adds broader narrative density and cadence rules, expands semantic-thinness and negation-reframe, updates cases/corpus/preserve files, and approves the reviewed fixture3 output.

# Decisions Made

- Added `perception-verb-density`, `body-action-density`, and `flat-action-cadence` under `narrative-slop` because these are fiction-prose repetition problems, not generic text metrics.
- Modeled semantic density as event-class repetition rather than exact word repetition.
- Kept contrast-pivot expansion inside `negation-reframe` instead of adding another contrast rule.
- Added a manifest-specific verifier so future agents can detect missing wiring, fixtures, corpus mirrors, source records, and pattern IDs mechanically.
- Removed implemented exact examples from the Sunstone not-implemented source note and recorded implemented material in the incorporation record.

# Key Files For Context

- `.plans/2026-05-17-172332-sunstone-slop-rule-expansion.md`
- `.plans/2026-05-17-172332-sunstone-slop-rule-expansion.md.manifest.toml`
- `scripts/verify-sunstone-slop-rule-expansion.py`
- `src/families/narrative-slop/perception-verb-density.ts`
- `src/families/narrative-slop/body-action-density.ts`
- `src/families/narrative-slop/flat-action-cadence.ts`
- `src/families/syntactic-patterns/contrast/private/negation-reframe-matcher.ts`
- `src/families/semantic-thinness/patterns/abstract-personification-line.json`
- `src/families/semantic-thinness/patterns/fixed-metaphor-frame.json`
- `src/families/semantic-thinness/patterns/sensory-instead-of-frame.json`
- `behavior/fixtures/textlint-rules/cases`
- `behavior/fixtures/textlint-rules/corpus`

# Verification

- no-hit scanner: `no_hit_message_count=0`
- `scripts/fixture3.sh check --suite textlint-rules`: `status: matched`
- `scripts/verify-all.sh`
- `npm run validate`

# Next Steps

- Run the broader rules on more generated Sunstone prose and review whether `perception-verb-density`, `body-action-density`, or `flat-action-cadence` need threshold changes.
