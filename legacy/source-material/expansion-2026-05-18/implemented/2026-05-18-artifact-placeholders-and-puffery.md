# Implemented: Artifact Placeholders And Puffery

This file archives candidates from `legacy/source-material/expansion-2026-05-18/remaining-candidates.md` that were implemented in Slopless on 2026-05-18.

## Artifact Placeholders

Source candidate files:

- `rule-libraries/derived/high-confidence-candidates.json`
- `rule-libraries/derived/fixture-corpus-ideas.md`
- `ai-slop/raw/slop-guard-rs/lib.rs`

Implemented in:

- `src/rules/orthography/artifact-placeholders.ts`
- `src/registries/orthography.ts`
- `src/presets/everything.ts`

Implemented forms:

- `:contentReference[oaicite:N]{index=N}`
- `[oaicite:N]`
- `oai_citation`
- `sandbox:/mnt/data/`
- `utm_source=chatgpt.com`
- `utm_source=openai`
- `[CITATION NEEDED]`
- `[INSERT TEXT]`
- `[PLACEHOLDER]`
- `Lorem ipsum`

Fixture coverage:

- `behavior/fixtures/textlint-rules/cases/orthography/hits.md`
- `behavior/fixtures/textlint-rules/cases/orthography/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/editorial-style.md`

False-positive controls:

- quoted examples are skipped
- blockquote examples are skipped
- inline code and fenced code are not traversed by this rule
- `colon-dramatic` skips known artifact-marker colons so artifact residue does not create duplicate colon findings

## Puffery Evaluative Claim Frames

Source candidate files:

- `academic-nlp/derived/subjectivity-and-puffery-candidates.json`
- `academic-nlp/derived/wikipedia-quality-labels.json`

Implemented in:

- `src/rules/semantic-thinness/patterns/puffery-evaluative-claim.json`
- `src/rules/semantic-thinness/private/pattern-data-d.ts`

Implemented forms:

- `The renowned architect changed the city forever.`
- `The product represents an unprecedented breakthrough.`
- `The tool is a masterpiece of modern design.`
- `The launch created the best version of the workflow.`
- `The golden standard for automation has arrived.`

Fixture coverage:

- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/engineering-review.md`

False-positive controls:

- broad puffery words are not banned by themselves
- templates stay bounded to generic praise frames
- no-hit controls include named people, dates, numeric benchmark evidence, and quoted usage discussion
