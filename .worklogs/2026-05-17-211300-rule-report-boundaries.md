# Rule Report Boundaries

## Summary

Added strict typed boundaries for rule detections, report policies, report objects, Textlint units, and Textlint report emission. Refactored the two density-gated narrative rules so they emit typed detections and rely on reporting code for density selection and adapter code for Textlint `RuleError` emission.

## Decisions Made

- Kept existing public Textlint rule module paths stable.
- Added `src/rules/types.ts` as the rule-domain boundary.
- Added `src/reporting/reports.ts` as the policy layer for one-to-one and density reports.
- Added `src/adapters/textlint/report.ts` and `src/adapters/textlint/units.ts` as the Textlint boundary.
- Removed the older `src/reporting/report-density.ts` callback API because density reporting now consumes typed detections instead of calling back into a detector.
- Expanded `scripts/verify-rules-reporting-architecture.py` to verify the new public boundary types and to prevent density rules from owning density-window logic or direct Textlint report emission.

## Key Files For Context

- `.plans/2026-05-17-210604-rule-report-boundaries.md`
- `.plans/2026-05-17-210604-rule-report-boundaries.md.manifest.toml`
- `src/rules/types.ts`
- `src/reporting/types.ts`
- `src/reporting/reports.ts`
- `src/adapters/textlint/report.ts`
- `src/adapters/textlint/units.ts`
- `src/rules/narrative-slop/body-action-density.ts`
- `src/rules/narrative-slop/perception-verb-density.ts`
- `scripts/verify-rules-reporting-architecture.py`

## Verification

- `scripts/verify-all.sh`
- `scripts/fixture3.sh check --suite textlint-rules`
- `npm run validate`

## Next Steps

- Migrate remaining one-to-one rules onto `RuleDetection[] -> oneToOneReports(...) -> emitTextlintReports(...)` when their rule logic is next touched.
