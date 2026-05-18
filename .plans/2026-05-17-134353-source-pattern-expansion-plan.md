# Goal

Expand archived source material into careful Slopless rules that catch reusable prose patterns, not only literal phrases.

The desired end state is:

- Source-derived pattern rules are grouped by the writing defect they detect.
- Literal phrase lists remain literal phrase lists.
- Broad word lists are used only as narrow slots or weak supporting evidence.
- Every added rule has hit and no-hit fixture lines under `behavior/fixtures/textlint-rules/cases/<family>/`.
- Every added rule also appears in at least one readable corpus file under `behavior/fixtures/textlint-rules/corpus/`.
- `fixture3 check --suite textlint-rules` shows the exact intended output change before approval.

# Approach

## 1. Normalize the source material into candidate groups

Create reviewed source notes under `legacy/source-material/derived/`.

Files:

- `legacy/source-material/derived/wordiness-pattern-candidates.md`
- `legacy/source-material/derived/redundancy-pattern-candidates.md`
- `legacy/source-material/derived/cliche-template-candidates.md`
- `legacy/source-material/derived/assistant-artifact-candidates.md`
- `legacy/source-material/derived/narrative-slop-candidates.md`
- `legacy/source-material/derived/corporate-abstraction-candidates.md`
- `legacy/source-material/derived/academic-slop-candidates.md`

Each file lists:

- source file
- source item
- normalized template
- intended family
- intended rule
- risk level
- fixture hit example
- fixture no-hit example

This prevents a direct dump from upstream lists into active rules.

## 2. Add a general token-template matcher only where current matchers are insufficient

Current reusable code:

- `src/shared/matchers/phrases.ts` handles literal phrases.
- `src/shared/matchers/prose-patterns.ts` handles simple sentence-level token checks.
- `src/families/semantic-thinness/private/pattern-matcher.ts` handles JSON templates, slots, `full`/`contains`, max token limits, and basic rejections.

Do not move the semantic-thinness matcher into `shared` unless at least two new families need the same JSON template behavior.

If reuse is needed, extract only the generic parts into:

- `src/shared/matchers/token-templates.ts`

Keep family-specific slot lists and reject rules inside family folders.

## 3. Add or expand families

### Phrases family

Use for literal phrase lexicons and narrow phrase templates that do not require sentence interpretation.

Existing rules to expand:

- `cliches`
- `corporate-speak`
- `llm-disclaimer`

New rules:

- `assistant-artifacts`
- `wordiness`
- `redundancy`

Rule IDs:

- `slopless/assistant-artifacts`
- `slopless/wordiness`
- `slopless/redundancy`

Why this family:

- The finding is local to a phrase span.
- The report can point at the matched phrase.
- These rules do not need paragraph-level context.

### Semantic thinness family

Use only for low-information sentence templates where the whole sentence is the problem.

Existing rule to expand:

- `semantic-thinness`

Do not add wordiness, cliches, or assistant artifacts here.

Good expansion targets:

- empty importance frames
- vague transformation frames
- hollow lesson frames when they are complete low-information sentences

### Syntactic patterns family

Use for rhetorical structures where the issue is sentence shape, not phrase content.

Existing rules to expand:

- `boilerplate-framing`
- `generic-signposting`
- `response-wrapper`
- `softening-language`
- `universalizing-claims`

Potential new rule:

- `importance-padding`

Only add `importance-padding` if it is structurally different from `semantic-thinness`.

### Words family

Use only for word-level checks and word stacking.

Existing rules to expand:

- `llm-vocabulary`
- `hedge-stacking`
- `simplicity`

Do not add single-word findings from empirical LLM excess-vocabulary lists unless the word is already proven bad in ordinary prose.

Use LLM vocabulary sources for:

- slot enrichment
- density checks
- phrase templates

### New narrative-slop family

Add only if the source review produces enough high-confidence narrative-specific templates.

Files:

- `src/families/narrative-slop/`
- `src/registries/narrative-slop.ts`

Rule IDs:

- `slopless/body-cliche`
- `slopless/voice-cliche`
- `slopless/atmosphere-cliche`
- `slopless/time-passage-cliche`

Why separate:

- "took a deep breath" and "her voice was low" are not globally bad.
- They are useful in generated-fiction audits.
- Mixing them into `phrases` would over-judge normal prose.

Alternative:

- Keep these disabled until fixtures prove acceptable precision.

### New academic-slop family

Add only if tortured-phrase material can be turned into exact phrase or narrow template matches.

Files:

- `src/families/academic-slop/`
- `src/registries/academic-slop.ts`

Rule IDs:

- `slopless/tortured-phrases`

Why separate:

- The source material is academic-paper specific.
- It should not be mixed into general prose rules.

# Concrete rule candidates

## `wordiness`

Sources:

- `legacy/source-material/prose-linters/npm-packages/too-wordy-0.3.6/too-wordy.js`
- `legacy/source-material/style-guides/microsoft/rules/Wordiness.yml`
- `legacy/source-material/style-guides/elastic/rules/Wordiness.yml`
- `legacy/source-material/plain-english/extracted/*.md`

Patterns:

- `{causeLead} the fact that`
- `based on the fact that`
- `despite the fact that`
- `in spite of the fact that`
- `in {timePoint} time`
- `at {timePoint} time`
- `during the {periodWord} of`
- `{purposeLead} to`
- `{purposeLead} of`
- `{abilityVerb} the ability to`
- `{performVerb} an {abstractAction} of`
- `{makeVerb} reference to`
- `{takeVerb} into account`

Slots:

- `causeLead`: `because of`, `due to`, `owing to`, `in light of`, `by virtue of`
- `timePoint`: `this point in`, `the present`, `this moment in`
- `periodWord`: `course`, `period`, `duration`
- `purposeLead`: `in order`, `in an effort`, `for the purpose`, `as a means`
- `abilityVerb`: `has`, `have`, `had`
- `performVerb`: `conduct`, `perform`, `carry out`
- `abstractAction`: `review`, `assessment`, `evaluation`, `investigation`

Care controls:

- Match exact token templates, not substrings.
- Report only the redundant span.
- Do not flag single words like `however`, `objective`, `validate`, `monitor`, or `purchase`.
- Add no-hit fixtures for legitimate technical uses.

## `redundancy`

Sources:

- `legacy/source-material/prose-linters/proselint/proselint/checks/redundancy/`
- `legacy/source-material/prose-linters/proselint/proselint/checks/redundancy/misc.py`

Patterns:

- `{redundantModifier} {baseNoun}`
- `{joinVerb} together`
- `{repeatVerb} again`
- `{returnVerb} back`
- `surrounded on all sides`
- `throughout the entire`
- `the whole entire`

Slots:

- `redundantModifier + baseNoun`: `basic fundamentals`, `actual fact`, `true facts`, `future plans`, `free gift`, `serious crisis`, `close proximity`, `new innovation`
- `joinVerb`: `blend`, `collaborate`, `combine`, `connect`, `merge`, `mix`, `gather`
- `repeatVerb`: `repeat`, `restate`, `reiterate`
- `returnVerb`: `return`, `refer`, `revert`

Care controls:

- Keep this as fixed pairs and small verb slots.
- Do not create a general "adjective + noun" redundancy detector.
- Add no-hit fixtures for `came back`, `looked back`, and non-redundant `together` uses.

## `assistant-artifacts`

Sources:

- `legacy/source-material/llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_phrases.jsonl`
- `legacy/source-material/llm-slop-lists/community-gists/*.md`
- current `src/families/phrases/llm-disclaimer.ts`
- current `src/families/syntactic-patterns/llm-artifacts/response-wrapper.ts`

Patterns:

- `let's delve into`
- `okay, let's delve`
- `feel free to ask`
- `please let me know`
- `hope this message finds you well`
- `break this down step by step`
- `want me to delve deeper`
- `last knowledge update`
- `deeper into a specific aspect`

Care controls:

- Exact phrase or narrow phrase templates only.
- Keep direct "as an AI language model" content in `llm-disclaimer` unless the existing rule is renamed.
- Add no-hit fixtures for quoted examples and article text discussing LLM artifacts.

## `cliches`

Sources:

- `legacy/source-material/prose-linters/npm-packages/cliches-1.0.6/glossary.js`
- existing `src/families/phrases/data/cliches.json`

Patterns:

- `{possessive} dirty laundry`
- `{possessive} eggs in one basket`
- `{possessive} head against a brick wall`
- `{possessive} chickens before they hatch`
- `{possessive} bubble`
- `{possessive} own horn`
- `{possessive} bridges`
- `{possessive} tongue`

Slots:

- `possessive`: `my`, `your`, `his`, `her`, `their`, `our`

Care controls:

- Convert only safe regex alternatives.
- Reject broad `\w+` expansions unless the surrounding frame is long and idiomatic.
- Preserve existing literal cliche lexicon.

## `corporate-speak`

Sources:

- existing `src/families/phrases/data/corporate-speak.json`
- plain-English source material
- Slop Forensics essay phrase list

Patterns:

- `{roleSubject} plays a {importanceAdjective} role`
- `{roleSubject} plays a {importanceAdjective} role in {abstractGerund}`
- `{roleSubject} serves as a {strengthAdjective} reminder of the importance of`
- `{roleSubject} provides {valueAdjective} insights`
- `{problemSubject} requires a {complexityAdjective} approach`
- `{actor} drives {abstractChange}`
- `{actor} fosters a culture of {positiveAbstractNoun}`
- `{actor} leverages {abstractPlural}`

Slots:

- `importanceAdjective`: `crucial`, `pivotal`, `vital`, `critical`, `significant`, `key`
- `abstractGerund`: `shaping`, `improving`, `driving`, `transforming`, `enhancing`
- `strengthAdjective`: `powerful`, `important`, `timely`
- `valueAdjective`: `valuable`, `actionable`, `meaningful`
- `complexityAdjective`: `multifaceted`, `comprehensive`, `holistic`, `nuanced`
- `abstractChange`: `innovation`, `transformation`, `growth`, `change`
- `positiveAbstractNoun`: `continuous improvement`, `continuous learning`, `innovation`, `collaboration`
- `abstractPlural`: `insights`, `synergies`, `opportunities`

Care controls:

- Do not flag `role` by itself.
- Require a full frame such as `plays a crucial role`, not just `crucial`.
- Add no-hit fixtures for real role descriptions, such as a person playing a role in a theater production.

## `semantic-thinness`

Sources:

- existing generated-corpus patterns
- Slop Forensics phrases where the full sentence is empty, not just formulaic

Patterns:

- `This is where {abstractNoun} begins.`
- `That is what makes {object} {evaluativeAdjective}.`
- `The real work begins {timeAdverb}.`
- `Everything changed {timeAdverb}.`
- `Something shifted in {setting}.`
- `{abstractNoun} was not just {thing}; it was {biggerThing}.`

Care controls:

- Keep full-sentence matching as the default.
- Preserve `maxTokens`.
- Keep reject words for causality and specificity.
- Do not move phrase-level corporate templates here.

## `narrative-slop`

Sources:

- `legacy/source-material/llm-slop-lists/slop-forensics/slop_list_bigrams.json`
- `legacy/source-material/llm-slop-lists/slop-forensics/slop_list_trigrams.json`
- current `behavior/fixtures/textlint-rules/corpus/narrative-scenes.md`

Patterns:

- `{character} took a deep breath`
- `{character} let out a breath`
- `{heart} {poundedVerb} in {chest}`
- `{chill} ran down {spine}`
- `{voice} was barely a whisper`
- `{words} hung in the air`
- `{air} was thick with {abstractNoun}`
- `{lightSource} cast long shadows`
- `{days} turned into {weeks}`

Care controls:

- Keep disabled from the default preset until fixture review shows acceptable precision, or add it to the default only if the user wants fiction-audit behavior by default.
- Add no-hit fixtures for ordinary physical action where the detail has consequence.
- Prefer reporting repeated density in a passage over one isolated ordinary gesture.

## `academic-slop`

Sources:

- `legacy/source-material/academic-slop/tortured-phrases/*.md`

Patterns:

- exact tortured phrases
- narrow replacement pairs from the paper-screener lists

Care controls:

- Keep out of general style families.
- Do not import scientific vocabulary as bad.
- Report only known tortured phrases.

## `llm-vocabulary`

Sources:

- `legacy/source-material/llm-excess-vocab/berenslab/excess_words.csv`
- `legacy/source-material/llm-excess-vocab/detect-chatgpt/ges_selected_lemma.csv`
- `legacy/source-material/llm-slop-lists/llm-cliches/*.txt`

Use:

- enrich slots for other rules
- optionally score repeated AI diction density later

Do not use:

- direct single-word findings for broad words like `across`, `analysis`, `approach`, `based`, `focused`, `explanatory`, or domain terms.

# Fixture plan

Add or update:

- `behavior/fixtures/textlint-rules/cases/phrases/hits.md`
- `behavior/fixtures/textlint-rules/cases/phrases/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/words/hits.md`
- `behavior/fixtures/textlint-rules/cases/words/no-hits.md`

If new families are created:

- `behavior/fixtures/textlint-rules/cases/narrative-slop/hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/academic-slop/hits.md`
- `behavior/fixtures/textlint-rules/cases/academic-slop/no-hits.md`

Corpus updates:

- add wordiness and redundancy examples to `editorial-style.md`
- add corporate abstraction examples to `engineering-review.md`
- add assistant artifacts to a new or existing corpus file only if it remains readable
- add narrative examples to `narrative-scenes.md`
- add academic tortured phrases to `technical-terminology.md` only if examples are explicitly academic

# Registry and package changes

For each new rule:

- add family file under `src/families/<family>/`
- add registry import under `src/registries/<family>.ts`
- add package export in `package.json`
- add README rule summary
- add source record in `legacy/source-material/incorporation-record.md`

For each new family:

- add registry file
- update preset export path if applicable
- update `scripts/behavior-replay.sh` `--rulesdir`
- update fixture3 manifest if the fixture list changes

# Verification

Run after each small batch:

```bash
npm run validate
scripts/fixture3.sh check --suite textlint-rules
scripts/verify-corpus-preserve.py
scripts/verify-source-material.py
scripts/verify-split-slopless.py
```

Review `.fixture3/textlint-rules/received.normalized.json` before accepting.

Accept only intended diffs:

```bash
scripts/fixture3.sh accept --suite textlint-rules
```

# Key decisions

- Do not import broad single-word LLM vocabulary as direct findings. It is too noisy.
- Do not put all new patterns into `semantic-thinness`. That family is for low-information sentence content.
- Do not create a universal "bad prose" rule. Rule IDs must explain what is bad.
- Keep narrative cliches separate because fiction prose has different false-positive behavior.
- Keep academic tortured phrases separate because that material is domain-specific.
- Prefer explicit token templates and slots over regex when possible.
- Only extract shared matcher code after the second family needs it.

# Files to modify

Expected:

- `legacy/source-material/derived/*.md`
- `legacy/source-material/incorporation-record.md`
- `src/families/phrases/*.ts`
- `src/families/phrases/data/*.json`
- `src/families/semantic-thinness/patterns/*.json`
- `src/families/syntactic-patterns/**/*.ts`
- `src/families/words/*.ts`
- `src/registries/*.ts`
- `package.json`
- `README.md`
- `behavior/fixtures/textlint-rules/cases/**/*.md`
- `behavior/fixtures/textlint-rules/corpus/*.md`
- `behavior/golden/textlint-rules/approved.*.json`

Possible:

- `src/shared/matchers/token-templates.ts`
- `src/families/narrative-slop/**/*.ts`
- `src/families/academic-slop/**/*.ts`

# Open checks before implementation

- Confirm whether narrative-slop should be enabled by default.
- Confirm whether academic-slop belongs in the default Slopless run.
- Confirm whether `llm-disclaimer` should absorb `assistant-artifacts` or stay narrow.
- Confirm whether `wordiness` and `redundancy` should live under `phrases` or new `style` family. Current recommendation is `phrases` because both are phrase-span reports.
