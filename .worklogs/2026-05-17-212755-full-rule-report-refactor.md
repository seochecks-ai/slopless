# Full Rule Report Refactor

## Summary

Completed the reporting boundary refactor across the full `src/rules` tree. Every direct Textlint `RuleError`, `report(...)`, and `locator` use was removed from rule files, and rule emission now goes through adapter helpers that create typed detections and reports before Textlint output.

## Decisions Made

- Added `emitTextlintFinding` for one-to-one findings so existing rule logic can stay local while report emission moves through `RuleDetection -> oneToOneReports -> emitTextlintReports`.
- Added `emitTextlintNodeFinding` for the one Textlint behavior that intentionally used default full-node highlighting (`sentence-case`).
- Kept all public Textlint rule module paths stable.
- Expanded the full-refactor manifest so future verification rejects direct Textlint reporting inside `src/rules/**`.
- Did not accept any fixture output changes. The fixture3 output is identical after preserving the original full-heading range behavior.

## Key Files For Context

- `.plans/2026-05-17-212141-full-rule-report-refactor.md`
- `.plans/2026-05-17-212141-full-rule-report-refactor.md.manifest.toml`
- `src/adapters/textlint/report.ts`
- `src/adapters/textlint/units.ts`
- `src/reporting/reports.ts`
- `src/reporting/types.ts`
- `src/rules/types.ts`
- `src/rules/**`
- `scripts/verify-rules-reporting-architecture.py`

## Verification

- `rg -n "new RuleError|\\breport\\(|RuleError|locator" src/rules`: no matches.
- `scripts/verify-all.sh`: passed.
- `scripts/fixture3.sh check --suite textlint-rules`: passed, `status: matched`.
- `npm run validate`: passed.

## Next Steps

- The next architecture cleanup should split each rule file further into pure detector exports and thin Textlint module wrappers, but the direct Textlint reporting dependency is now removed from the rules tree.
