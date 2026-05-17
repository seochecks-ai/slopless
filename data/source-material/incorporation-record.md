# Incorporation Record

This file records what Slopless has already incorporated into active rules.

It is separate from `data/source-material/README.md`, which records source material that has been archived but not necessarily used.

## Status Terms

- `active`: used by a shipped textlint rule.
- `archived`: downloaded under `data/source-material`, not yet used by a shipped rule.
- `candidate`: reviewed as useful, but not active yet.
- `rejected`: reviewed and deliberately not used.

## Active External Sources

### `no-cliches`

- Status: `active`
- Source: `no-cliches@0.3.0`
- URL: https://github.com/duereg/no-cliches
- Active rule data:
  - `src/families/phrases/data/cliches.json`
  - `src/families/phrases/data/cliches.source.md`
- Active rule:
  - `src/families/phrases/cliches.ts`
- Incorporated as:
  - literal phrase lexicon
- Local changes:
  - trimmed, deduplicated, sorted
  - unsafe broad entries removed where fixture review showed false-positive risk

### Vale `proselint` cliches

- Status: `active`
- Source: Vale package `proselint/proselint/Cliches.yml`
- URL: https://github.com/errata-ai/proselint
- Active rule data:
  - `src/families/phrases/data/cliches.json`
  - `src/families/phrases/data/cliches.source.md`
- Active rule:
  - `src/families/phrases/cliches.ts`
- Incorporated as:
  - literal phrase lexicon
- Local changes:
  - merged into the existing cliche list
  - deduplicated against `no-cliches`
  - converted `whet (?:the|your) appetite` into literal phrases
  - kept `pain in the` excluded because it catches literal medical prose such as `pain in the neck`

### `proselint` corporate speak

- Status: `active`
- Source: `proselint==0.16.0`
- URL: https://github.com/amperser/proselint
- Imported file:
  - `proselint/checks/industrial_language/corporate_speak.py`
- Cross-check source:
  - Vale `proselint/CorporateSpeak.yml`
- Active rule data:
  - `src/families/phrases/data/corporate-speak.json`
  - `src/families/phrases/data/corporate-speak.source.md`
- Active rule:
  - `src/families/phrases/corporate-speak.ts`
- Incorporated as:
  - literal phrase lexicon
- Local changes:
  - trimmed, deduplicated, sorted

### `proselint` skunked terms

- Status: `active`
- Source: `proselint==0.16.0`
- URL: https://github.com/amperser/proselint
- Imported file:
  - `proselint/checks/skunked_terms.py`
- Cross-check source:
  - Vale `proselint/Skunked.yml`
- Active rule data:
  - `src/families/phrases/data/skunked-terms.json`
  - `src/families/phrases/data/skunked-terms.source.md`
- Active rule:
  - `src/families/phrases/skunked-terms.ts`
- Incorporated as:
  - literal phrase lexicon
- Local changes:
  - trimmed, deduplicated, sorted
  - normalized trailing punctuation from `Thankfully,`

### `proselint` uncomparables

- Status: `active`
- Source: `proselint==0.16.0`
- URL: https://github.com/amperser/proselint
- Imported file:
  - `proselint/checks/uncomparables.py`
- Cross-check source:
  - Vale `proselint/Uncomparables.yml`
- Active rule data:
  - `src/families/phrases/data/uncomparables.json`
  - `src/families/phrases/data/uncomparables.source.md`
- Active rule:
  - `src/families/phrases/uncomparables.ts`
- Incorporated as:
  - comparator list
  - adjective list
  - exception list
- Local changes:
  - added runtime exception for `least possible`

## Active Internal Sources

### Generated slop corpus mining

- Status: `active`
- Source:
  - generated slop fixtures and mined findings from earlier Slopless development
  - Sunstone generated prose samples supplied as fixture material
  - reviewed fixture hits under `.plans/textlint-hit-review`
- Main planning records:
  - `.plans/2026-05-13-183302-generated-slop-corpus-mining-report.md`
  - `.plans/2026-05-13-185249-semantic-thinness-broad-formula-patterns.md`
  - `.plans/2026-05-13-194300-semantic-thinness-hit-ledger.md`
  - `.plans/textlint-hit-review/semantic-thinness-good-catches.md`
  - `.plans/textlint-hit-review/semantic-thinness-bad-catches.md`
- Active rule data:
  - `src/families/semantic-thinness/patterns/*.json`
  - `src/families/semantic-thinness/private/pattern-data*.ts`
- Active rule:
  - `src/families/semantic-thinness/semantic-thinness.ts`
- Incorporated as:
  - local pattern families
  - slot-based templates
  - positive and negative fixture cases
- Pattern examples:
  - `something-shifted`
  - `real-work-begins`
  - `silence-as-actor`
  - `truth-answer-moves`
  - `deictic-summary`
  - `point-is-frame`
  - `body-knows`
  - `empty-scene-state`
  - `empty-emotional-weather`
- Local changes:
  - built our own template matcher instead of importing an upstream matcher
  - mined repeated AI-slop formulas from generated stories, essays, articles, persona-style prose, and Sunstone prose
  - hand-picked high-confidence examples into pattern files
  - added negative examples for concrete movement, concrete scene changes, measurements, dates, and other likely false positives

### Hand-authored syntactic slop patterns

- Status: `active`
- Source:
  - reviewed fixture hits
  - hand-authored patterns from observed AI and bad-prose output
  - earlier Rust/Prosesmasher behavior replay where applicable
- Main planning records:
  - `.plans/2026-05-12-180446-textlint-rule-taxonomy.md`
  - `.plans/2026-05-13-023908-migrate-llm-slop-textlint.md`
  - `.plans/textlint-hit-review/`
- Active rule folders:
  - `src/families/syntactic-patterns/authority`
  - `src/families/syntactic-patterns/closers`
  - `src/families/syntactic-patterns/contrast`
  - `src/families/syntactic-patterns/generalization`
  - `src/families/syntactic-patterns/lead-ins`
  - `src/families/syntactic-patterns/llm-artifacts`
  - `src/families/syntactic-patterns/repetition`
- Incorporated as:
  - rule-local pattern arrays
  - token sequence checks
  - sentence-sequence checks
  - local match functions
- Pattern examples:
  - `negation-reframe`
  - `fragment-stacking`
  - `triple-repeat`
  - `llm-openers`
  - `generic-signposting`
  - `boilerplate-conclusion`
  - `authority-padding`
  - `response-wrapper`
- Local changes:
  - no generic global pattern registry
  - no shared semantic slots unless reuse is proven
  - matchers stay inside each family when ownership is local

### Current LLM vocabulary seed list

- Status: `active`
- Source:
  - hand-picked AI-slop vocabulary from fixture review and earlier generated corpus work
- Active rule:
  - `src/families/words/llm-vocabulary.ts`
- Incorporated as:
  - small literal word set
- Current risk:
  - intentionally small
  - external empirical LLM word sources are archived but not yet active because broad words have high false-positive risk

### Assistant leakage and response-wrapper patterns

- Status: `active`
- Source:
  - observed assistant-output leakage forms
  - hand-authored examples from LLM response conventions
- Active rules:
  - `src/families/phrases/llm-disclaimer.ts`
  - `src/families/syntactic-patterns/llm-artifacts/response-wrapper.ts`
- Incorporated as:
  - sentence-start patterns
  - contains patterns
  - capability and limitation frames
- Pattern examples:
  - `as a language model`
  - `as an ai language model`
  - `my knowledge cutoff date is`
  - `i do not have access to real-time information`
  - `i can provide`
  - `i cannot diagnose`

## Archived But Not Yet Active

### Empirical LLM excess-vocabulary sources

- Status: `archived`
- Sources:
  - `data/source-material/llm-excess-vocab/berenslab/excess_words.csv`
  - `data/source-material/llm-excess-vocab/detect-chatgpt/ges_selected_lemma.csv`
- Intended use:
  - candidate word scores
  - weak signals
  - possible domain-specific academic detector
- Not active because:
  - many items are broad or domain-specific
  - default prose rules need fixture review before import

### Slop Forensics

- Status: `archived`
- Source:
  - `data/source-material/llm-slop-lists/slop-forensics/`
- Intended use:
  - direct ngram candidates
  - phrase-count mining
  - template generation
- Not active because:
  - creative-writing lists include names and genre terms
  - phrases need false-positive review before import

### `llm-cliches` and community ChatGPT lists

- Status: `archived`
- Sources:
  - `data/source-material/llm-slop-lists/llm-cliches/`
  - `data/source-material/llm-slop-lists/detect-ai-text-easily/`
  - `data/source-material/llm-slop-lists/community-gists/`
- Intended use:
  - candidate word and phrase review
  - fixture generation
  - rule ideas
- Not active because:
  - provenance and precision vary by source
  - broad words need fixture review

### Prose-linter packages not yet imported

- Status: `archived`
- Sources:
  - `write-good`
  - `too-wordy`
  - `weasel-words`
  - `adverb-where`
  - npm `cliches`
  - extra `proselint` folders beyond active phrase data
- Intended use:
  - wordiness lexicons
  - hedge/weasel lists
  - adverb and weakener patterns
  - regex-like cliche templates that can be converted to token templates
- Not active because:
  - several lists are broad
  - several upstream rules are regex or helper-code behavior, not direct Slopless data

### Vale style guides

- Status: `archived`
- Sources:
  - Microsoft
  - Google
  - Elastic
  - Joblint
- Intended use:
  - replacement pairs
  - wordiness candidates
  - domain-specific technical or hiring language
  - pattern ideas for punctuation and passive voice
- Not active because:
  - style-guide policy is not identical to Slopless default prose quality
  - domain-specific rules should stay separate from default slop detection

### Plain-English sources

- Status: `archived`
- Sources:
  - GOV.UK
  - GCA
  - Plain English Campaign
  - Peter Occil
- Intended use:
  - wordiness candidates
  - replacement pairs
  - formal filler phrases
  - template candidates with placeholders
- Not active because:
  - requires normalization into candidate lists and fixtures first

### Academic tortured phrases

- Status: `archived`
- Sources:
  - Cabanac 2021
  - Problematic Paper Screener
  - Zenodo humanities/social-science tortured phrase data
- Intended use:
  - academic-specific phrase-pair detector
  - paraphrase-template mining
- Not active because:
  - domain-specific
  - should not run in default prose rules without an explicit academic family

## Matching Architecture We Built Ourselves

Slopless does not run upstream prose-linter plugins directly.

Current active rules use Textlint only for traversal, reporting, ranges, and rule execution. The actual slop detection is local TypeScript.

### Literal Phrase Matching

- Used for phrase datasets such as cliches, corporate speak, skunked terms, and prohibited phrases.
- Implemented with local token normalization and phrase matching.
- Source data is stored as JSON under `src/families/phrases/data`.
- Reports include the exact matched phrase where the rule can identify it.

### Token And Sentence Pattern Matching

- Used for syntactic families.
- Implemented as rule-local arrays and match functions.
- Uses sentence extraction, normalized text, and token matching from `src/shared/text`.
- Keeps matcher ownership inside the family unless reuse is proven.

### Semantic Thinness Templates

- Used for semantic-thinness.
- Pattern data is stored as one JSON file per pattern family.
- Each pattern owns:
  - `id`
  - `class`
  - `purpose`
  - `templates`
  - `slots`
  - `rejectIf`
  - `positiveExamples`
  - `negativeExamples`
  - `notes`
- The matcher compiles templates like `{genericSubject} had {changeVerb}.` into literal and slot parts.
- Slot values are tokenized locally.
- `matchMode: full` matches complete short sentences.
- `matchMode: contains` matches formulae inside longer sentences.
- Common rejection gates block digits, empty text, overlong matches, and some clause markers for full-sentence patterns.

## Fixture Review Process

- Minimal case fixtures live under `behavior/fixtures/textlint-rules/cases`.
- Realistic prose fixtures live under `behavior/fixtures/textlint-rules/corpus`.
- Corpus fixtures preserve the same expected signals as cases where practical.
- Golden output is maintained through Fixture3.
- Reviewed findings are recorded under `.plans/textlint-hit-review`.
- Good and bad catches from generated corpus runs were used to decide which semantic and syntactic patterns became active.

## Update Rule

When a source moves from `archived` to `active`, update this file in the same commit as the rule data and fixtures.

Each update must include:

- source name and URL
- active rule file
- active data file, if any
- incorporation type: literal lexicon, replacement pair, token pattern, sentence pattern, semantic template, or domain-specific source
- local transformations
- false-positive exclusions or reviewed caveats
