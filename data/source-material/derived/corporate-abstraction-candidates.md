# Corporate Abstraction Not Implemented

## Source File Paths Used

- `data/source-material/prose-linters/proselint/proselint/checks/industrial_language/corporate_speak.py`
- `data/source-material/plain-english/extracted/govuk-style-guide-words-to-avoid.md`
- `data/source-material/plain-english/extracted/gca-words-not-to-use.md`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/essays/slop_lists/slop_list_phrases.jsonl`
- `data/source-material/llm-slop-lists/slop-forensics/results_by_domain/varied_prompts/slop_lists/slop_list_phrases.jsonl`

## Not Implemented

- `{actor} drives {abstractChange}`
- `{actor} leverages {abstractPlural}`

## Slots

- `abstractChange`: `innovation`, `transformation`, `growth`, `change`, `progress`
- `abstractPlural`: `insights`, `synergies`, `opportunities`, `solutions`

## Why Not Implemented

- The implemented corporate abstraction rule only uses closed frames that are specific enough to report directly.
- `drives` and `leverages` are too broad without stronger surrounding constraints.
- The remaining frames are too broad without stronger surrounding constraints.

## Required Fixture Work Before Implementation

- Add no-hits for literal driving, database drivers, and concrete leverage.
- Add hits only when the frame is abstract and promotional.
- Verify the rule does not report normal technical prose.
