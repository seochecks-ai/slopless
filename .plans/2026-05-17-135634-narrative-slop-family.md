# Goal

Add the `narrative-slop` textlint family with `slopless/narrative-cliches`.

The rule should detect narrow narrative cliche frames sourced from Slop Forensics ngram lists without broad grammar or POS behavior.

# Approach

- Add `src/families/narrative-slop/data/narrative-cliches.json` with reviewed template groups for body sensation, voice beat, atmosphere, and time passage.
- Add a family-private token template matcher that supports literal tokens plus named slots only.
- Add `src/families/narrative-slop/narrative-cliches.ts` to scan paragraph sentences and report full sentence ranges when a reviewed frame matches.
- Add `src/registries/narrative-slop.ts`, export it from `src/index.ts`, enable it in `src/presets/everything.ts`, and add the package export.
- Add the rulesdir to `scripts/behavior-replay.sh`.
- Add hit and no-hit Markdown fixtures under `behavior/fixtures/textlint-rules/cases/narrative-slop/`.

# Key Decisions

- Use reviewed phrase frames and closed slot lists, not source ngrams as direct phrases.
- Keep the matcher private to the new family for this task because the semantic-thinness matcher carries rule-specific rejection behavior.
- Report sentence ranges to match the existing semantic-thinness family and avoid brittle partial-span offsets inside normalized templates.

# Files To Modify

- `src/families/narrative-slop/**`
- `src/registries/narrative-slop.ts`
- `src/index.ts`
- `src/presets/everything.ts`
- `package.json`
- `scripts/behavior-replay.sh`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/*.md`
