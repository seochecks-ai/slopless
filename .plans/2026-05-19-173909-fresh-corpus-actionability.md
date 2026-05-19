# Goal

Make the fresh generated corpus actionable for rule development instead of a pile of loosely related generated examples.

The desired end state:

- Generated corpus files stay included in Slopless analysis and feature mining.
- Spellcheck still ignores generated corpus files.
- Edge-case files use case blocks, not line counts.
- Each family hit file produces direct findings from that family.
- Each family no-hit file produces zero direct findings from that family.
- Families that need paragraph clusters or document-shaped text get paragraph clusters or document-shaped text.
- Rule expansion decisions are encoded as code, data, or verifier rows, not prose implications.

# Approach

1. Update the fresh corpus plan contract.
   - Add a manifest for actionable family expectations.
   - Define direct rule ownership by family.
   - Define case block counts for each generated hit/no-hit file.
   - Define which files require sidecar term-policy configs.

2. Replace generated edge-case files with block-shaped cases.
   - Use `---` as the case separator.
   - Keep cases isolated, but make each case as large as the family needs.
   - `metrics` cases become document-like paragraphs.
   - `narrative-slop` cases become paragraph clusters with enough local density.
   - `term-policy` cases use sidecar configs.
   - `orthography` cases contain literal punctuation/artifact forms.
   - Other families use sentence or short-paragraph cases where direct rules can evaluate them.

3. Make academic boilerplate a real academic rule.
   - Add `academic-boilerplate`.
   - Keep `tortured-phrases` focused on its current scientific-term corruption list.
   - Add academic boilerplate hit/no-hit cases to the fresh research corpus.

4. Expand existing semantic and phrase checks from the reviewed generated misses.
   - Add a recursive meaning/importance semantic-thinness pattern.
   - Add the high-signal phrase lead-ins to prohibited phrase data.

5. Add deterministic verification.
   - Update `verify-fresh-slop-corpus.py` so it counts case blocks, not non-header lines.
   - Add `verify-fresh-corpus-actionability.py`.
   - Wire both fresh corpus verifiers into `verify-all.sh`.

# Decisions

- Generated corpus is never excluded from Slopless analysis.
- `new-corpus` remains excluded from `cspell`.
- A case can be one sentence, one paragraph, or multiple paragraphs.
- Case separation is `---`.
- Hit/no-hit status is enforced by direct-family rule output.
- Cross-family findings are allowed in hit files.
- Cross-family findings are not the proof that a family case works.
- No-hit files must have zero direct-family findings.
- Academic boilerplate belongs to `academic-slop`, not `phrases`, because the bad move is scholarly abstract padding.
- Fresh corpus word expansion does not add broad new single-word bans. Fresh word hits use the current prohibited vocabulary. Multi-word business slop belongs to `phrases` or `semantic-thinness`.
- Term-policy generated cases require sidecar configs because the rule family is config-driven.

# Files To Modify

- `.plans/2026-05-19-173909-fresh-corpus-actionability.md.manifest.toml`
- `.plans/2026-05-19-165026-fresh-slop-corpus-expansion.md.manifest.toml`
- `scripts/verify-fresh-slop-corpus.py`
- `scripts/verify-fresh-corpus-actionability.py`
- `scripts/verify-all.sh`
- `src/registries/academic-slop.ts`
- `src/rules/academic-slop/academic-boilerplate.ts`
- `src/rules/academic-slop/data/academic-boilerplate.json`
- `src/rules/semantic-thinness/private/pattern-data-d.ts`
- `src/rules/semantic-thinness/patterns/recursive-meaning-frame.json`
- `src/rules/phrases/data/prohibited-phrases.json`
- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/hits/*.md`
- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/no-hits/*.md`
- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/hits/term-policy.term-policy.textlintrc.json`
- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/no-hits/term-policy.term-policy.textlintrc.json`
- `new-corpus/2026-05-19-fresh-slop-expansion/analysis/initial-expansion-ideas.md`
