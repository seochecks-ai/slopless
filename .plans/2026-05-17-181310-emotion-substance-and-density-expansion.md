# Goal

Generalize the remaining Sunstone slop cases beyond exact examples.

The implementation should add emotion-as-substance semantic templates, summary-fog templates, and broader narrative event-class density support for body-position beats, staging movement, perception choreography, animal body cues, and flat cadence.

# Approach

1. Generate variant source notes for emotion-as-substance and action-density classes.
2. Add semantic-thinness pattern data for emotion-as-substance and summary-fog transitions.
3. Expand narrative density rules to count multi-word event phrases, not only single tokens.
4. Add the remaining user-supplied examples to hit fixtures.
5. Add additional generated variants to fixtures and corpus.
6. Add no-hit controls for literal physical substances, real medical/body facts, weather, cause clauses, object changes, and deliberate early-reader pacing.
7. Update the manifest verifier so missing pattern IDs, fixture lines, corpus lines, and variant source files fail mechanically.
8. Replay fixture output, inspect no-hit cases, accept only after review.

# Key Decisions

- Emotion-as-substance belongs in `semantic-thinness` because it turns abstract emotion into stock physical motion.
- Summary fog belongs in `semantic-thinness` because it replaces action with a vague transition.
- Event-class density belongs in `narrative-slop` because it is a repeated prose mechanism across different words.
- Slots must be abstracted as classes:
  - abstract emotion/state
  - physical motion/substance verb
  - body container/surface
  - person/group/place target
  - event class
  - phrase pattern

# Files To Modify

- `.plans/2026-05-17-181310-emotion-substance-and-density-expansion.md.manifest.toml`
- `scripts/verify-emotion-substance-and-density-expansion.py`
- `scripts/verify-all.sh`
- `legacy/source-material/derived/sunstone-emotion-substance-variants.md`
- `legacy/source-material/derived/sunstone-action-density-variants.md`
- `legacy/source-material/derived/sunstone-slop-cases.md`
- `legacy/source-material/incorporation-record.md`
- `src/rules/semantic-thinness/patterns/*.json`
- `src/rules/semantic-thinness/private/pattern-data*.ts`
- `src/rules/narrative-slop/body-action-density.ts`
- `src/rules/narrative-slop/flat-action-cadence.ts`
- `src/rules/narrative-slop/perception-verb-density.ts`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/*`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/*`
- `behavior/fixtures/textlint-rules/corpus/narrative-scenes.md`
- `behavior/fixtures/textlint-rules/corpus/narrative-scenes.preserve.json`

# Non-Goals

- Do not add a POS parser.
- Do not add machine learning.
- Do not create a new family.
- Do not accept golden output until no-hit cases are clean.
