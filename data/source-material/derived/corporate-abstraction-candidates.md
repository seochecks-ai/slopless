# Corporate Abstraction Candidates

## Source file paths used

- `data/source-material/prose-linters/proselint/proselint/checks/industrial_language/corporate_speak.py`
- `src/families/phrases/data/corporate-speak.json`
- `src/families/phrases/data/corporate-speak.source.md`
- `data/source-material/plain-english/extracted/govuk-style-guide-words-to-avoid.md`
- `data/source-material/plain-english/extracted/gca-words-not-to-use.md`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/essays/slop_lists/slop_list_phrases.jsonl`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_phrases.jsonl`

## Candidate templates or exact phrases

- `{roleSubject} plays a {importanceAdjective} role`
- `{roleSubject} plays a {importanceAdjective} role in {abstractGerund}`
- `{roleSubject} serves as a {reminderAdjective} reminder of the importance of`
- `{roleSubject} serves as a testament to the power of`
- `{sourceSubject} provides {valueAdjective} insights`
- `{sourceSubject} offers {valueAdjective} insights`
- `{sourceSubject} provides a comprehensive overview`
- `{problemSubject} requires a {complexityAdjective} approach`
- `{actor} drives {abstractChange}`
- `{actor} fosters a culture of {positiveAbstractNoun}`
- `{actor} leverages {abstractPlural}`

## Slots

- `roleSubject`: closed noun phrase before `plays`, capped at 8 tokens.
- `importanceAdjective`: `crucial`, `pivotal`, `vital`, `critical`, `significant`, `key`
- `abstractGerund`: `shaping`, `improving`, `driving`, `transforming`, `enhancing`
- `reminderAdjective`: `powerful`, `important`, `timely`, `stark`
- `valueAdjective`: `valuable`, `actionable`, `meaningful`, `important`
- `complexityAdjective`: `multifaceted`, `comprehensive`, `holistic`, `nuanced`
- `abstractChange`: `innovation`, `transformation`, `growth`, `change`, `progress`
- `positiveAbstractNoun`: `continuous improvement`, `continuous learning`, `innovation`, `collaboration`
- `abstractPlural`: `insights`, `synergies`, `opportunities`, `solutions`

## Risk controls

- Do not flag `role`, `key`, `insights`, or `approach` by themselves.
- Require a complete frame such as `plays a crucial role`.
- Exclude literal acting frames, theater roles, permission roles, database roles, and access-control roles.
- Keep source-derived corporate catchphrases such as `circle back around` as literal phrase candidates, not abstraction templates.
- Add no-hit cases for specific operational claims with concrete actors, dates, measurements, or named systems.

## Hit example lines

- `The initiative plays a crucial role in shaping future outcomes.`
- `The report provides valuable insights for stakeholders.`
- `This milestone serves as a powerful reminder of the importance of collaboration.`
- `The platform fosters a culture of continuous improvement.`

## No-hit example lines

- `Maya plays a crucial role in Act II of the school production.`
- `The report provides the measured error rate for each endpoint.`
- `The reminder at 09:00 tells operators to rotate the signing key.`
- `Postgres uses database roles to grant table access.`
