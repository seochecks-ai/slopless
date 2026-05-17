# Summary

Added a maintained record of source material already incorporated into active Slopless rules.

The record distinguishes active external sources, active internal generated-corpus sources, archived-but-unused sources, local matcher architecture, and the update rule for future imports.

# Decisions Made

- Created `data/source-material/incorporation-record.md` instead of expanding only the archive README because the archive inventory and active incorporation history answer different questions.
- Documented active imported plugins and packages: `no-cliches`, Vale `proselint` cliches, and selected `proselint` phrase datasets.
- Documented generated-corpus-derived semantic-thinness and syntactic-pattern rules as internal sources, since their provenance is fixture review and hand-picked AI-slop examples rather than an upstream package.
- Documented the local template matcher architecture because Slopless uses Textlint for execution/reporting, not upstream matcher behavior.

# Key Files For Context

- `data/source-material/incorporation-record.md`
- `data/source-material/README.md`
- `src/families/phrases/data/*.source.md`
- `src/families/semantic-thinness/patterns/*.json`
- `src/families/semantic-thinness/private/pattern-matcher.ts`
- `.plans/2026-05-13-183302-generated-slop-corpus-mining-report.md`
- `.plans/2026-05-13-185249-semantic-thinness-broad-formula-patterns.md`
- `.plans/textlint-hit-review/`

# Verification

- `npm run format:check`
- `python3 scripts/verify-source-material.py`
- `npm run validate`

# Next Steps

- Update `data/source-material/incorporation-record.md` in the same commit whenever an archived source becomes active rule data.
