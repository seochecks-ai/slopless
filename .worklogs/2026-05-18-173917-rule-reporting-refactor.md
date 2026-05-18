# Rule Reporting Refactor

## Summary

Refactored the full rule surface so rule files emit typed detections and reporting is applied through the shared textlint adapter. Added manifests for the refactor and the next density/check implementation pass. Fixture output remains unchanged.

## Decisions Made

- Added `defineTextlintRule` as the only textlint rule adapter path for refactored rules.
- Moved one-to-one, density, and document-threshold policy application into `src/reporting/reports.ts`.
- Added text unit builders for document, paragraph, all-paragraph, sentence, section-first sentence, section-last sentence, heading, string, and link nodes.
- Kept `negation-reframe` on all paragraphs because the prior rule intentionally reported inside list items.
- Kept density rules as single cue detectors plus report policy thresholds.
- Did not implement the new formal transition, repeated-start, or uncited-authority checks in this pass.

## Key Files For Context

- `.plans/2026-05-18-171548-rule-reporting-refactor.md`
- `.plans/2026-05-18-171548-rule-reporting-refactor.md.manifest.toml`
- `.plans/2026-05-18-171548-new-density-checks.md`
- `.plans/2026-05-18-171548-new-density-checks.md.manifest.toml`
- `src/adapters/textlint/rule.ts`
- `src/adapters/textlint/units.ts`
- `src/reporting/reports.ts`
- `src/rules/private/textlint-rule-builders.ts`
- `scripts/verify-rules-reporting-architecture.py`

## Verification

- `rg -n "emitTextlint|RuleHelper|context\\.report|RuleError|textlint-rule-helper" src/rules -g '*.ts'` returned no matches.
- `scripts/fixture3.sh check --suite textlint-rules` passed with `status: matched`.
- `npm run validate` passed.
- `scripts/verify-all.sh` passed.

## Next Steps

- Implement the checks in `.plans/2026-05-18-171548-new-density-checks.md` using the new detector/reporting boundary.
