# Summary

Built the fresh slop expansion corpus for the next rule-widening analysis pass. The generated corpus contains 10 long prose files, 34,257 text words, and 1,206 edge cases split across family hit and no-hit files.

# Decisions Made

- Kept all generated material under `new-corpus/2026-05-19-fresh-slop-expansion` instead of moving it into behavior fixtures.
- Added a manifest and deterministic verifier so corpus scale and family coverage are checked mechanically.
- Ran current Slopless over the new corpus and recorded first-pass expansion ideas in `analysis/initial-expansion-ideas.md`.
- Added `new-corpus` to cspell ignore paths because this is generated research material with invented names and intentionally bad language, not package source prose.

# Key Files For Context

- `.plans/2026-05-19-165026-fresh-slop-corpus-expansion.md`
- `.plans/2026-05-19-165026-fresh-slop-corpus-expansion.md.manifest.toml`
- `scripts/verify-fresh-slop-corpus.py`
- `new-corpus/2026-05-19-fresh-slop-expansion/README.md`
- `new-corpus/2026-05-19-fresh-slop-expansion/analysis/initial-expansion-ideas.md`
- `new-corpus/2026-05-19-fresh-slop-expansion/texts/`
- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/`

# Verification

- `pnpm run validate`
- `scripts/verify-all.sh`
- `scripts/verify-fresh-slop-corpus.py`

# Next Steps

- Review the generated hit files against current Slopless output.
- Promote only reviewed examples into `behavior/fixtures/textlint-rules/cases`.
- Widen existing families after the no-hit controls for each targeted rule are selected.
