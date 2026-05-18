# Rule Report Boundaries

## Goal

Separate rule detection from reporting mechanics with strict TypeScript boundaries. Rules should emit typed detections. Reporting code should decide which detections become findings. Textlint adapter code should be the only layer that creates `RuleError` and calls `report`.

## Approach

1. Add typed rule boundary contracts for rule IDs, text units, source ranges, detections, report policies, and reports.
2. Add a reporting layer that turns detections into reports with one-to-one and density policies.
3. Add a Textlint adapter layer that emits reports as Textlint `RuleError`s.
4. Refactor density-based narrative rules to pure detectors plus reporting policy wiring.
5. Add mechanical verification for the boundary:
   - core rule/report type files exist
   - density rules do not own density-window logic
   - density rules do not call Textlint `report`
   - Textlint emission exists only in the adapter
6. Run fixture3 and validation after the refactor.

## Key Decisions

- Keep public Textlint rule entry points stable for now. The package still exports the existing rule module paths.
- Move only the actual emission boundary into the adapter in this pass. Full migration of every rule to pure detectors can happen rule-by-rule after the boundary is stable.
- Density rules are the first strict users because they already required cross-rule reporting policy.

## Files To Modify

- `src/rules/types.ts`
- `src/reporting/types.ts`
- `src/reporting/reports.ts`
- `src/adapters/textlint/report.ts`
- `src/adapters/textlint/units.ts`
- `src/rules/narrative-slop/body-action-density.ts`
- `src/rules/narrative-slop/perception-verb-density.ts`
- `scripts/verify-rules-reporting-architecture.py`
- `scripts/verify-all.sh`
- behavior golden files if output changes
