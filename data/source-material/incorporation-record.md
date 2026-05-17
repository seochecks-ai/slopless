# Incorporation Record

This file records source material already implemented in Slopless rules.

Research material that is not implemented stays in `data/source-material/derived/*.md`. Those files must not repeat implemented phrases or templates.

## Implemented External Sources

### `no-cliches`

- Source: `no-cliches@0.3.0`
- URL: https://github.com/duereg/no-cliches
- Rule data:
  - `src/families/phrases/data/cliches.json`
  - `src/families/phrases/data/cliches.source.md`
- Rule:
  - `src/families/phrases/cliches.ts`
- Implemented as:
  - literal phrase lexicon
- Local changes:
  - trimmed, deduplicated, sorted
  - unsafe broad entries removed where fixture review showed false-positive risk

### Vale `proselint` Cliches

- Source: Vale package `proselint/proselint/Cliches.yml`
- URL: https://github.com/errata-ai/proselint
- Rule data:
  - `src/families/phrases/data/cliches.json`
  - `src/families/phrases/data/cliches.source.md`
- Rule:
  - `src/families/phrases/cliches.ts`
- Implemented as:
  - literal phrase lexicon
- Local changes:
  - merged into the existing cliche list
  - deduplicated against `no-cliches`
  - converted `whet (?:the|your) appetite` into literal phrases
  - kept `pain in the` excluded because it catches literal medical prose such as `pain in the neck`

### `proselint` Corporate Speak

- Source: `proselint==0.16.0`
- URL: https://github.com/amperser/proselint
- Imported file:
  - `proselint/checks/industrial_language/corporate_speak.py`
- Cross-check source:
  - Vale `proselint/CorporateSpeak.yml`
- Rule data:
  - `src/families/phrases/data/corporate-speak.json`
  - `src/families/phrases/data/corporate-speak.source.md`
- Rule:
  - `src/families/phrases/corporate-speak.ts`
- Implemented as:
  - literal phrase lexicon
- Local changes:
  - trimmed, deduplicated, sorted

### `proselint` Skunked Terms

- Source: `proselint==0.16.0`
- URL: https://github.com/amperser/proselint
- Imported file:
  - `proselint/checks/skunked_terms.py`
- Cross-check source:
  - Vale `proselint/Skunked.yml`
- Rule data:
  - `src/families/phrases/data/skunked-terms.json`
  - `src/families/phrases/data/skunked-terms.source.md`
- Rule:
  - `src/families/phrases/skunked-terms.ts`
- Implemented as:
  - literal phrase lexicon
- Local changes:
  - trimmed, deduplicated, sorted
  - normalized trailing punctuation from `Thankfully,`

### `proselint` Uncomparables

- Source: `proselint==0.16.0`
- URL: https://github.com/amperser/proselint
- Imported file:
  - `proselint/checks/uncomparables.py`
- Cross-check source:
  - Vale `proselint/Uncomparables.yml`
- Rule data:
  - `src/families/phrases/data/uncomparables.json`
  - `src/families/phrases/data/uncomparables.source.md`
- Rule:
  - `src/families/phrases/uncomparables.ts`
- Implemented as:
  - comparator list
  - adjective list
  - exception list
- Local changes:
  - added runtime exception for `least possible`

## Implemented Internal Sources

### Generated Slop Corpus Mining

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
- Rule data:
  - `src/families/semantic-thinness/patterns/*.json`
  - `src/families/semantic-thinness/private/pattern-data*.ts`
- Rule:
  - `src/families/semantic-thinness/semantic-thinness.ts`
- Implemented as:
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

### Hand-Authored Syntactic Slop Patterns

- Source:
  - reviewed fixture hits
  - hand-authored patterns from observed AI and bad-prose output
  - earlier Rust/Prosesmasher behavior replay where applicable
- Main planning records:
  - `.plans/2026-05-12-180446-textlint-rule-taxonomy.md`
  - `.plans/2026-05-13-023908-migrate-llm-slop-textlint.md`
  - `.plans/textlint-hit-review/`
- Rule folders:
  - `src/families/syntactic-patterns/authority`
  - `src/families/syntactic-patterns/closers`
  - `src/families/syntactic-patterns/contrast`
  - `src/families/syntactic-patterns/generalization`
  - `src/families/syntactic-patterns/lead-ins`
  - `src/families/syntactic-patterns/llm-artifacts`
  - `src/families/syntactic-patterns/repetition`
- Implemented as:
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

### Current LLM Vocabulary Seed List

- Source:
  - hand-picked AI-slop vocabulary from fixture review and earlier generated corpus work
- Rule:
  - `src/families/words/llm-vocabulary.ts`
- Implemented as:
  - small literal word set
- False-positive control:
  - external empirical LLM word sources are not implemented because broad words have high false-positive risk

### Assistant Leakage And Response-Wrapper Patterns

- Source:
  - observed assistant-output leakage forms
  - hand-authored examples from LLM response conventions
- Rules:
  - `src/families/phrases/llm-disclaimer.ts`
  - `src/families/syntactic-patterns/llm-artifacts/response-wrapper.ts`
- Implemented as:
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

## Implemented Source-Derived Pattern Data

- Wordiness:
  - `src/families/phrases/wordiness.ts`
  - `src/families/phrases/data/wordiness-patterns.json`
  - newly implemented exact phrases: `in view of the fact that`, `the question as to whether`, `until such time as`
- Redundancy:
  - `src/families/phrases/redundancy.ts`
  - `src/families/phrases/data/redundancy-patterns.json`
  - newly implemented exact phrases: `interact with each other`, `visible to the eye`, `while at the same time`
- Cliche templates:
  - `src/families/phrases/cliches.ts`
  - `src/families/phrases/data/cliche-templates.json`
- Corporate abstraction:
  - `src/families/phrases/corporate-speak.ts`
  - `src/families/phrases/data/corporate-abstraction-patterns.json`
  - newly implemented template: `serves as a testament to the power of`
- LLM disclaimers:
  - `src/families/phrases/llm-disclaimer.ts`
  - `src/families/phrases/data/llm-disclaimer-expansions.json`
- Response wrappers:
  - `src/families/syntactic-patterns/llm-artifacts/response-wrapper.ts`
  - `src/families/syntactic-patterns/llm-artifacts/data/response-wrapper-patterns.json`
  - newly implemented paragraph-start wrappers: `it is important to note`, `it's important to note`, `it is worth noting`, `it's worth noting`
- Narrative cliches:
  - `src/families/narrative-slop/narrative-cliches.ts`
  - `src/families/narrative-slop/data/narrative-cliches.json`
- Academic tortured phrases:
  - `src/families/academic-slop/tortured-phrases.ts`
  - `src/families/academic-slop/data/tortured-phrases.json`
  - newly implemented exact phrases: `data and interchanges innovation`, `man-made reasoning`, `shut circuit tv`
- Local transformations:
  - broad source regex groups were converted only when they mapped to closed slots
  - empirical LLM ngrams were reduced to reviewed frames instead of imported wholesale
  - assistant identity and knowledge-limit phrases were added to `llm-disclaimer`
  - chat scaffold phrases were added to existing `response-wrapper`, not a duplicate rule
- False-positive controls:
  - quoted phrase examples are skipped by phrase matchers
  - academic checks use exact known tortured phrases
  - narrative checks use narrow reviewed frames and skip concrete-cause sentences

## Matching Architecture We Built Ourselves

Slopless does not run upstream prose-linter plugins directly.

Current rules use Textlint only for traversal, reporting, ranges, and rule execution. The slop detection is local TypeScript.

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
- Good and bad catches from generated corpus runs were used to decide which semantic and syntactic patterns were implemented.

## Update Rule

When source material is implemented, update this file in the same commit as the rule data and fixtures.

Each update must include:

- source name and URL
- rule file
- data file, if any
- implementation type: literal lexicon, replacement pair, token pattern, sentence pattern, semantic template, or domain-specific source
- local transformations
- false-positive exclusions or reviewed caveats
