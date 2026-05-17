# Goal

Implement only the remaining source-derived patterns that are narrow enough to report without broad false-positive risk.

# Approach

1. Add exact academic tortured phrases that are clearly unnatural English.
2. Add exact wordiness phrases where the shorter equivalent is stable.
3. Add exact redundancy phrases where repeated meaning is local and mechanical.
4. Add the narrow corporate frame `serves as a testament to the power of`.
5. Add paragraph-start LLM boilerplate openers for `important to note` and `worth noting`.
6. Add hit and no-hit cases for every new behavior.
7. Add corpus prose and preserve entries for new case material.
8. Remove newly implemented items from `data/source-material/derived`.
9. Run fixture replay, inspect no-hit output, update approved output only after review.

# Files To Modify

- `src/families/academic-slop/data/tortured-phrases.json`
- `src/families/phrases/data/wordiness-patterns.json`
- `src/families/phrases/data/redundancy-patterns.json`
- `src/families/phrases/data/corporate-abstraction-patterns.json`
- `src/families/syntactic-patterns/llm-artifacts/data/response-wrapper-patterns.json`
- relevant case and corpus fixtures
- `data/source-material/derived/*.md`
- `data/source-material/incorporation-record.md`

# Non-Goals

- Do not implement broad narrative breath/voice/smile patterns.
- Do not implement `drives`, `leverages`, `capacity`, `opportunity`, `software program`, `emergency situation`, or legal/policy exception phrases.
- Do not create a new rule family.
