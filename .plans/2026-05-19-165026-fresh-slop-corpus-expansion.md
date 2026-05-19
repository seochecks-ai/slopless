# Goal

Build a large fresh prose and edge-case corpus for the next deterministic Slopless widening pass, without changing rule behavior yet.

# Approach

- Generate a new corpus under `new-corpus/2026-05-19-fresh-slop-expansion`.
- Generate long prose texts from multiple distinct slop-producing angles.
- Generate adversarial hit and no-hit edge cases for each active rule family.
- Keep this material separate from behavior fixtures until reviewed.
- Produce an initial expansion analysis that names likely existing-rule widenings and false-positive controls.

# Corpus Angles

- LinkedIn inspirational consulting.
- AI-rewritten SEO/AI-search thought leadership.
- Venture/product strategy memo.
- Wellness and self-improvement advice.
- Academic-adjacent explanatory prose.
- Technical audit and engineering review prose.
- Corporate internal change-management memo.
- Fiction narrative scene prose.
- UX/product-marketing launch copy.
- Agent-written rewrite of a rough draft into smoother slop.

# Edge-Case Families

- `semantic-thinness`
- `syntactic-patterns`
- `narrative-slop`
- `phrases`
- `words`
- `orthography`
- `metrics`
- `academic-slop`
- `term-policy`

# Required Scale

- At least 10 long text files.
- At least 25,000 total words across long text files.
- At least 50 hit cases per family.
- At least 35 no-hit cases per family.
- At least 900 total edge-case lines.
- Every edge-case file must be plain Markdown with one case per Markdown paragraph or list item.
- No generated material goes directly into `behavior/fixtures` in this pass.

# Files To Create

- `new-corpus/2026-05-19-fresh-slop-expansion/README.md`
- `new-corpus/2026-05-19-fresh-slop-expansion/texts/*.md`
- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/hits/*.md`
- `new-corpus/2026-05-19-fresh-slop-expansion/edge-cases/no-hits/*.md`
- `new-corpus/2026-05-19-fresh-slop-expansion/analysis/initial-expansion-ideas.md`
- `scripts/verify-fresh-slop-corpus.py`

# Verification

- The verifier must count text files, text words, edge-case files, and edge-case lines.
- The verifier must fail if any required family hit/no-hit file is missing.
- The verifier must fail if the corpus is below the required scale.
- The verifier must fail if generated corpus files are accidentally placed under `behavior/fixtures`.
