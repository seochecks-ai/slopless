# Summary

Restored the removed fresh-corpus edge cases and fixed the false positives that had caused no-hit controls to be dropped. Split fixture3 approvals by family and corpus file so approved JSON stays below the generated G3TS 1 MiB staged-file limit.

# Decisions Made

- Restored prior generated hit and no-hit cases instead of keeping the reduced verifier-only corpus.
- Fixed word-rule false positives with contextual gates for quoted, meta, and domain-specific uses.
- Fixed `negation-reframe` false positives by rejecting meta/factual inline negation contexts and requiring abstract vocabulary for comma-only contrasts.
- Fixed `colon-dramatic` by requiring dramatic reveal setup before the colon instead of flagging all short colon tails.
- Replaced the monolithic `textlint-rules` fixture3 approval with split suites because the large file violated the G3TS staged-file cap.

# Key Files For Context

- `.plans/2026-05-19-182607-restore-adversarial-corpus.md`
- `fixture3.yaml`
- `src/rules/words/private/vocabulary-context.ts`
- `src/rules/syntactic-patterns/contrast/private/negation-context-gates.ts`
- `src/rules/orthography/colon-dramatic.ts`
- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/`
- `behavior/golden/textlint-rules-*/approved.normalized.json`

# Next Steps

- Use `scripts/fixture3.sh check --feature textlint-rules` for fixture3 approval checks.
- If an approved output file approaches 1 MiB again, split that suite further before approving drift.
