# Goal

Implement the Sunstone slop categories as runnable Textlint rules and pattern expansions, deliberately broad enough to expose false positives in fixtures.

# Approach

1. Expand `semantic-thinness` pattern data for fixed scene, metaphor, empty summary, and abstract-personification frames.
2. Expand `negation-reframe` for contractions, `not just`, `no longer`, and `instead` contrast pivots.
3. Add narrative density rules for repeated perception verbs and repeated semantically related body/blocking actions.
4. Add a narrative cadence rule for flat runs of short simple action sentences.
5. Add hit and no-hit cases for every new behavior.
6. Add matching corpus prose and preserve metadata.
7. Keep all implemented source material recorded and remove implemented lines from not-implemented source notes if they become fully covered.
8. Run fixture replay and review new findings before accepting output.

# Key Decisions

- Use the existing `semantic-thinness` template matcher for narrow fixed frames.
- Keep contrast-pivot logic in `negation-reframe`; do not add a duplicate contrast rule.
- Put density and cadence rules in `narrative-slop`, because the problem is prose movement/body-camera repetition rather than generic grammar.
- For semantic density, use small verb/body-cue groups first instead of exact word repetition:
  - perception: `look`, `watch`, `stare`, `gaze`, `glance`, `observe`
  - blocking/movement: `step`, `walk`, `stand`, `sit`, `turn`, `cross`, `climb`, `crouch`, `stop`, `wait`
  - body cues: `ear`, `tail`, `chest`, `stomach`, `heart`, `breath`, `paw`
- Report once per paragraph or short sentence window when a group repeats too densely.

# Files To Modify

- `.plans/2026-05-17-172332-sunstone-slop-rule-expansion.md.manifest.toml`
- `scripts/verify-sunstone-slop-rule-expansion.py`
- `scripts/verify-all.sh`
- `src/rules/semantic-thinness/patterns/*.json`
- `src/rules/syntactic-patterns/contrast/private/*`
- `src/rules/syntactic-patterns/contrast/negation-reframe.ts`
- `src/rules/narrative-slop/*.ts`
- `src/registries/narrative-slop.ts`
- `src/presets/everything.ts`
- `package.json`
- `behavior/fixtures/textlint-rules/cases/*`
- `behavior/fixtures/textlint-rules/corpus/*`
- `legacy/source-material/derived/sunstone-slop-cases.md`
- `legacy/source-material/incorporation-record.md`

# Non-Goals

- Do not add a POS parser yet.
- Do not add ML or embeddings.
- Do not create a new family.
- Do not weaken existing rules to make fixture output match.
