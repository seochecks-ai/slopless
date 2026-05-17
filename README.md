# slopless

[![npm](https://img.shields.io/npm/v/slopless?label=npm)](https://www.npmjs.com/package/slopless)
[![downloads](https://img.shields.io/npm/dm/slopless)](https://www.npmjs.com/package/slopless)
[![license](https://img.shields.io/github/license/agent-quality-controls/slopless)](LICENSE)
[![node](https://img.shields.io/node/v/slopless)](package.json)


Catch AI and human slop in Markdown without calling an LLM. Slopless ships 50+ deterministic textlint rules and a CLI that emits structured JSON findings.

It reports patterns that make prose padded, vague, generic, formulaic, or mechanically careless. It does not call an LLM. Output is always textlint JSON.

## Install

```bash
npm install -D slopless
```

## Run

```bash
npx slopless "docs/**/*.md"
npx slopless draft.md > slopless.json
cat draft.md | npx slopless --stdin --stdin-filename draft.md
```

Add an npm script:

```json
{
  "scripts": {
    "lint:prose": "slopless \"docs/**/*.md\""
  }
}
```

```bash
npm run lint:prose
```

Slopless requires a file path, glob, or stdin input. A bare `npx slopless` exits with code `2`.

## Behavior

- Requires Node.js 20 or newer.
- Requires no `.textlintrc.json`.
- Requires no separate `textlint` install.
- Supports inline `textlint-disable` comments for rule ignores.
- Emits textlint JSON only.
- Rejects `--format` and `-f`.
- Exits `0` for no findings, `1` for prose findings, and `2` for command failure.

Each JSON message includes the rule ID, line, column, message, and range data when textlint provides it. Rule IDs use `slopless/<rule-name>` in wrapped textlint output, such as `slopless/semantic-thinness`.

## Ignore Rules

Ignore one rule for a block:

```markdown
<!-- textlint-disable slopless/semantic-thinness -->

Something shifted in the room.

<!-- textlint-enable slopless/semantic-thinness -->
```

Ignore several rules:

```markdown
<!-- textlint-disable slopless/semantic-thinness, slopless/llm-openers -->

The important thing is that something shifted in the room.

<!-- textlint-enable slopless/semantic-thinness, slopless/llm-openers -->
```

Ignore all Slopless findings in a block:

```markdown
<!-- textlint-disable -->

Something shifted in the room.

<!-- textlint-enable -->
```

Markdown comments must sit on their own lines, with blank lines around the ignored text.

## Rules

Metrics:

- `avg-sentence-length`: average sentence length above 24 words.
- `paragraph-length`: paragraphs over 6 sentences.
- `word-repetition`: one non-trivial word repeated over 5 times.
- `flesch-kincaid`: Flesch Reading Ease below 61.
- `gunning-fog` and `coleman-liau`: grade scores above 12.

Orthography:

- `colon-dramatic`: short reveals after a colon, such as `And then: everything changed.`
- `em-dashes`: closed em dashes.
- `exclamation-density`: more than 1 exclamation mark per paragraph.
- `fake-timestamps`: clock specificity, such as `5:47 PM`.
- `sentence-case`: title-case headings.
- `smart-quotes`: curly quotes.

Phrases and words:

- `cliches`: stock phrases, such as `at the end of the day`.
- `corporate-speak`: business filler and empty abstraction, such as `move the needle` or `plays a crucial role`.
- `hedge-stacking`: stacked hedges, such as `might perhaps`.
- `humble-bragger`: credential lead-ins, such as `in my experience`.
- `jargon-faker`: borrowed tech metaphors, such as `debug your morning`.
- `llm-disclaimer`: assistant leakage, such as `as an AI language model` or `my knowledge cutoff`.
- `llm-vocabulary`: common AI diction, such as `delve`.
- `prohibited-phrases` and `prohibited-words`: package-owned banned lists.
- `redundancy`: repeated-meaning phrases, such as `repeat again`.
- `recommended-terms` and `required-terms`: configured missing terms.
- `simplicity`: complex words with simple replacements, such as `utilize`.
- `skunked-terms`: contested broad-use terms.
- `uncomparables`: impossible modifiers, such as `very unique`.
- `wordiness`: padded phrases, such as `due to the fact that`.

Academic slop:

- `tortured-phrases`: known machine-paraphrased academic phrases, such as `counterfeit consciousness`.

Narrative slop:

- `narrative-cliches`: stock generated-fiction gestures, such as `heart pounded in her chest`.

Semantic thinness:

- `semantic-thinness`: low-information templates, such as `Something shifted in the room.`

Syntactic patterns:

- `affirmation-closers`: empty certainty endings, such as `and that is the key`.
- `authority-padding`: soft authority padding, such as `research shows`.
- `blame-reframe`: blame-to-insight reframes, such as `the problem is not X, it is Y`.
- `boilerplate-conclusion`: generic endings, such as `in conclusion`.
- `boilerplate-framing`: generic setup, such as `when it comes to`.
- `contrastive-aphorism`: slogan contrasts, such as `not faster, but smarter`.
- `demonstrative-emphasis`: vague `this is what` emphasis.
- `empty-emphasis`: unsupported importance claims, such as `this matters`.
- `false-question`: rhetorical questions, such as `isn't that what we all want?`
- `fragment-stacking`: clipped cadence, such as `Too broad. Too vague. Too late.`
- `generic-signposting`: generic transitions, such as `it is important to note`.
- `lesson-framing`: lesson extraction, such as `the lesson is`.
- `llm-openers`: generic openers, such as `the important thing is`.
- `negation-reframe`: `not X. It is Y.` constructions.
- `observer-guidance`: reader-instruction frames, such as `notice how`.
- `response-wrapper`: chat wrappers, such as `let's delve into` or `please let me know`.
- `softening-language`: vague softeners, such as `in many ways`.
- `summative-closer`: summary payoff lines, such as `that is what makes it work`.
- `triple-repeat`: repeated sentence openers, such as `It is X. It is Y. It is Z.`
- `universalizing-claims`: broad claims, such as `everyone knows`.

## Direct Textlint Use

Most users should run `npx slopless "docs/**/*.md"`.

The package also exports a textlint preset:

```json
{
  "filters": {
    "comments": true
  },
  "rules": {
    "preset-slopless": true
  }
}
```

```bash
npx textlint "docs/**/*.md"
```
