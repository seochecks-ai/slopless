# Summary

Cleaned the source-material records so research state is binary: implemented material is recorded in the incorporation record, and derived research files list only material not implemented.

No rule behavior changed.

# Decisions Made

- Removed implemented phrases and templates from `legacy/source-material/derived/*.md`.
- Replaced status terms such as active, archived, candidate, rejected, and partially active with implemented versus not implemented wording.
- Kept unimplemented material grouped by family with direct reasons and required fixture work.
- Did not accept fixture output because fixture behavior did not change.

# Key Files For Context

- `legacy/source-material/README.md`
- `legacy/source-material/incorporation-record.md`
- `legacy/source-material/derived/academic-slop-candidates.md`
- `legacy/source-material/derived/cliche-template-candidates.md`
- `legacy/source-material/derived/corporate-abstraction-candidates.md`
- `legacy/source-material/derived/llm-artifact-candidates.md`
- `legacy/source-material/derived/narrative-slop-candidates.md`
- `legacy/source-material/derived/redundancy-pattern-candidates.md`
- `legacy/source-material/derived/wordiness-pattern-candidates.md`

# Verification

- `rg` found no lifecycle status terms in source-material records.
- implemented literal scan found `implemented_literal_occurrences_in_derived=0`.
- `scripts/fixture3.sh diff --suite textlint-rules`: `status: matched`
- `scripts/verify-all.sh`
- `npm run validate`

# Next Steps

- Implement remaining source-derived material one category at a time, with hit and no-hit fixtures in the same commit as each rule-data change.
