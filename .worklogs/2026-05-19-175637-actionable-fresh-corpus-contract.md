# Summary

Converted the fresh generated corpus from line-counted research material into an actionable block-case corpus with mechanical direct-family verification. Added direct rule coverage for academic boilerplate, recursive semantic meaning frames, and high-signal phrase lead-ins.

# Decisions Made

- Case units in the fresh corpus are now blocks separated by `---`, not non-empty Markdown lines.
- Generated hit files must produce direct findings from their own family; generated no-hit files must produce zero direct findings from their own family.
- Metrics and narrative generated cases now use paragraph/document-shaped blocks because those families are not sentence-list checks.
- Academic boilerplate is implemented as `academic-slop:academic-boilerplate`, separate from `tortured-phrases`.
- The fresh corpus did not add broad new single-word bans; multi-word slop from the review went into phrase and semantic pattern coverage.
- Fixed `scripts/behavior-replay.sh` so configured outputs cannot overwrite each other when files in different directories share the same basename.

# Key Files For Context

- `.plans/2026-05-19-173909-fresh-corpus-actionability.md`
- `.plans/2026-05-19-173909-fresh-corpus-actionability.md.manifest.toml`
- `scripts/verify-fresh-corpus-actionability.py`
- `scripts/verify-fresh-slop-corpus.py`
- `scripts/behavior-replay.sh`
- `src/rules/academic-slop/academic-boilerplate.ts`
- `src/rules/semantic-thinness/patterns/recursive-meaning-frame.json`
- `src/rules/phrases/data/prohibited-phrases.json`
- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/`
- `behavior/fixtures/textlint-rules/cases/`
- `behavior/fixtures/textlint-rules/corpus/editorial-style.md`

# Verification

- `scripts/fixture3.sh diff --suite textlint-rules --refresh`
- `scripts/verify-all.sh`
- `pnpm run validate`

# Next Steps

- Use the actionability verifier before promoting any future generated corpus cases.
- Review the fresh corpus direct-family findings when planning the next broad rule expansion pass.
