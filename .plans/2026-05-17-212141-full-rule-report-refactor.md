# Full Rule Report Refactor

## Goal

Finish the rule/report boundary refactor across the whole rule tree. No rule implementation under `src/rules/**` should create Textlint errors or call Textlint report directly. Rules should produce typed detections and pass them through reporting/adapters.

## Approach

1. Keep public rule module paths stable.
2. Extend the Textlint adapter helpers so one-to-one rules can emit typed detections without repeating boilerplate.
3. Refactor every remaining rule under `src/rules/**` that still uses direct Textlint emission.
4. Strengthen `scripts/verify-rules-reporting-architecture.py`:
   - fail if any `src/rules/**/*.ts` imports `RuleError`
   - fail if any `src/rules/**/*.ts` calls Textlint `report(...)`
   - fail if any `src/rules/**/*.ts` creates `new RuleError`
   - require the adapter/reporting boundary files and public exports
5. Run fixture3 and validation. Approved output should remain unchanged.

## Files To Modify

- `src/adapters/textlint/report.ts`
- `src/adapters/textlint/units.ts`
- `src/reporting/reports.ts`
- `src/reporting/types.ts`
- `src/rules/**/*.ts`
- `scripts/verify-rules-reporting-architecture.py`
- `scripts/verify-all.sh`

## Done

- `rg -n "new RuleError|\\breport\\(" src/rules` returns no matches.
- `scripts/verify-all.sh` passes.
- `scripts/fixture3.sh check --suite textlint-rules` passes with `status: matched`.
- `npm run validate` passes.
