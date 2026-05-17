# Goal

Implement SPX-2 phrase-family active code and data only.

Add `slopless/wordiness` and `slopless/redundancy`, expand `cliches`, `corporate-speak`, and `llm-disclaimer`, and avoid any new `assistant-artifacts` rule.

# Approach

- Add reviewed phrase pattern data under `src/families/phrases/data/`.
- Use token templates with explicit reviewed slots for cliche and corporate pattern expansions.
- Keep wordiness and redundancy as exact phrases generated from the reviewed templates and slots.
- Reuse the phrase matcher boundary so rules report local phrase spans and skip quoted examples.
- Register and enable only the two new phrase rules.
- Add package exports for the two new rules.
- Add a few phrase fixture hit/no-hit lines, without accepting fixture output.

# Key Decisions

- Do not add POS dictionaries or broad grammar behavior.
- Do not create `assistant-artifacts`; expand `llm-disclaimer` with the requested LLM leakage phrases.
- Do not update fixture golden output.
- Do not commit.

# Files To Modify

- `src/shared/matchers/phrases.ts`
- `src/families/phrases/*.ts`
- `src/families/phrases/data/*.json`
- `src/registries/phrases.ts`
- `src/presets/everything.ts`
- `package.json`
- `behavior/fixtures/textlint-rules/cases/phrases/*.md`
