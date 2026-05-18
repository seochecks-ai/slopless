# Rule Reporting Refactor

## Goal

Make rule implementation and reporting mechanically separate across the repo.

Rules should detect local evidence and return typed detections. Reporting should decide whether those detections become textlint findings. Density should be a reporting policy over detections, not custom logic embedded inside individual rules.

## Approach

- Add a textlint rule adapter that accepts a typed rule definition, builds text units, runs the detector, applies the report policy, and emits textlint reports.
- Add unit builders for document, paragraph, sentence, heading, and text nodes so rule files do not need to hand-map textlint offsets.
- Move report policy application into `src/reporting/reports.ts`.
- Refactor rule files so they no longer call `context.report`, construct `RuleError`, or import the old textlint emit helpers directly.
- Keep public rule IDs, messages, and fixture output stable.
- Update the existing reporting architecture verifier so this boundary cannot regress.

## Key Decisions

- Keep exported textlint rule modules in `src/rules/**` because package exports already expose that shape.
- Allow rule files to import the textlint rule adapter, because the default export is still a textlint rule module.
- Forbid direct textlint emission from rule files. The only allowed reporting path is the adapter.
- Keep density as a report policy over single detections.
- Do not implement new checks in this refactor.

## Files To Modify

- `src/adapters/textlint/report.ts`
- `src/adapters/textlint/rule.ts`
- `src/adapters/textlint/units.ts`
- `src/reporting/reports.ts`
- `src/reporting/types.ts`
- `src/rules/**/*.ts`
- `scripts/verify-rules-reporting-architecture.py`
- `scripts/verify-all.sh`

