# Summary

Archived external source material for future Slopless lexicons, phrase rules, and pattern/template mining.

The archive includes empirical LLM vocabulary sources, Slop Forensics word/ngram/phrase lists, prose linter packages, Vale style-guide rules, plain-English avoid-word sources, and academic tortured-phrase material.

# Decisions Made

- Kept raw source material under `data/source-material` instead of importing it into active rules because this change is source capture, not rule behavior.
- Added cleaned extracted Markdown notes for web/PDF sources where direct lexicon extraction is practical.
- Omitted npm package/test/build scaffolding from archived npm packages because repository validators treated nested package metadata as package roots.
- Ignored `data/source-material` in Prettier, ESLint, and cspell because the folder contains raw upstream source dumps.
- Added `scripts/verify-source-material.py` so the archive has mechanical checks for parseability, key counts, failed downloads, and zip integrity.

# Key Files For Context

- `data/source-material/README.md`
- `data/source-material/llm-excess-vocab/berenslab/excess_words.csv`
- `data/source-material/llm-excess-vocab/detect-chatgpt/ges_selected_lemma.csv`
- `data/source-material/llm-slop-lists/slop-forensics/`
- `data/source-material/prose-linters/proselint/`
- `data/source-material/prose-linters/npm-packages/`
- `data/source-material/style-guides/`
- `data/source-material/plain-english/extracted/`
- `data/source-material/academic-slop/tortured-phrases/`
- `scripts/verify-source-material.py`
- `.plans/2026-05-17-125853-source-material-capture.md`

# Verification

- `npm run validate`
- `python3 scripts/verify-source-material.py`
- Adversarial review pass found initial archive blockers.
- Second adversarial review pass found no blocking issues after cleanup.

# Next Steps

- Build normalized candidate files from the archived sources before importing anything into active rules.
- Start with direct low-risk phrase sources, then review empirical LLM word lists separately because they have higher false-positive risk.
