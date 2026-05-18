# Rules Reporting Refactor

## Goal

Make `src/rules/*` the canonical home for rule detection and add `src/reporting/*` for reusable report policies. Density should not be hardcoded as a family-specific concept inside detector files.

## Approach

1. Move `src/rules/*` to `src/rules/*` and update imports, registries, package exports, fixture runner paths, cspell output expectations, and verifier references.
2. Add `src/reporting/types.ts` for a generic detection shape and `src/reporting/report-density.ts` for window/group density selection.
3. Refactor `perception-verb-density.ts` and `body-action-density.ts` so they collect detections and delegate density thresholding to `report-density`.
4. Leave one-to-one rules behavior-preserving in this pass. They can adopt `report-each` later when there is a concrete rule boundary to simplify.
5. Add a verifier for the new architecture that checks canonical `rules` paths, required reporting modules, runner paths, registry imports, and no stale `src/rules` implementation paths.

## Key Decisions

- `rules/*` is canonical because the rule owns detection logic.
- `reporting/*` owns generic reporting policy such as density.
- Do not add a separate detector package yet. There are only two density users, so a `Detection` type plus one generic density selector is enough.
- Keep textlint rule IDs unchanged. This is an internal structure refactor, not a behavior or product rename.

## Files To Modify

- `src/rules/**` -> `src/rules/**`
- `src/registries/**`
- `scripts/behavior-replay.sh`
- `package.json`
- `scripts/verify-*.py`
- `scripts/verify-all.sh`
- `legacy/source-material/incorporation-record.md`
- `.worklogs/*`
- `src/reporting/types.ts`
- `src/reporting/report-density.ts`
- `src/rules/narrative-slop/perception-verb-density.ts`
- `src/rules/narrative-slop/body-action-density.ts`
