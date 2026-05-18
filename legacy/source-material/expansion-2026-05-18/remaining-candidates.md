# Remaining Candidates

This is the active queue for `legacy/source-material/expansion-2026-05-18/`.

Implemented material from the latest batches is archived in:

- `implemented/2026-05-18-ai-slop-gaps.md`
- `implemented/2026-05-18-artifact-placeholders-and-puffery.md`

Raw captures and extraction reports stay in place as provenance. The list below is the working implementation review queue.

## Best Next Implementation Candidates

### 1. Markdown file artifacts

Source files:

- `rule-libraries/derived/high-confidence-candidates.json`
- `rule-libraries/derived/fixture-corpus-ideas.md`

Signals:

- `TODOCS`
- merge conflict markers such as `<<<<<<< HEAD`
- Markdown table rows with inconsistent cell counts
- heading text wrapped entirely in bold markup, such as `## **Overview**`

Recommended implementation:

- Existing family: `markdown-layout`.
- Rule split:
  - `markdown-layout:merge-conflict-markers`
  - `markdown-layout:placeholder-artifacts`
  - `markdown-layout:table-shape`
  - `markdown-layout:bold-heading`
- Keep bold list lead-ins out of the first batch because they are common house style in technical docs.

Why next:

- It is deterministic.
- The family already exists as an empty folder.
- It expands Slopless beyond prose phrases into shipped Markdown defects.

Required no-hit controls:

- A blockquote explaining merge conflict markers.
- A valid Markdown table.
- A heading that uses bold text inside the body but is not itself a fully bold heading.

### 2. Formal transition opener density

Source files:

- `rule-libraries/derived/high-confidence-candidates.json`
- `ai-slop/derived/high-confidence-deterministic-candidates.json`
- `ai-slop/raw/aismells/llms-full.txt`

Signals:

- `Additionally,`
- `Furthermore,`
- `Moreover,`
- `In addition,`
- `Notably,`
- `Consequently,`
- `Therefore,`
- `Thus,`
- `Ultimately,`

Recommended implementation:

- Existing family: `syntactic-patterns/lead-ins`.
- Better rule name: `formal-transition-density`.
- Count sentence openers per paragraph and adjacent sentence window.
- Report only repeated density, not a single opener.

Why next:

- It catches a real LLM rhythm problem.
- It can be implemented using existing sentence extraction.
- It has clear false-positive control through density.

Required no-hit controls:

- One valid `However,` or `Therefore,` in an argument paragraph.
- Legal, academic, or technical prose with one formal transition.
- A blockquote with repeated transitions.

### 3. Uncited authority frames

Source files:

- `ai-slop/derived/high-confidence-deterministic-candidates.json`
- `academic-nlp/derived/wikipedia-quality-labels.json`
- `academic-nlp/derived/vagueness-specificity-candidates.json`

Signals:

- `studies show`
- `studies have shown`
- `research suggests`
- `research demonstrates`
- `experts agree`
- `experts suggest`
- `it is widely believed`
- `many believe`
- `some critics argue`
- `some argue`

Recommended implementation:

- Existing family: `syntactic-patterns/authority`.
- Extend `authority-padding` or create `uncited-authority`.
- Report when the authority frame has no nearby citation marker, URL, named source, year, or concrete study name.

Why next:

- It maps directly to existing `authority-padding`.
- It catches empty authority, not just style.
- It can be narrow if we require missing local evidence.

Risks:

- Citation detection can be brittle.
- Valid summaries can use these phrases when evidence is nearby.

Required no-hit controls:

- `Research suggests` followed by a named study and year.
- `Studies have shown` followed by a Markdown citation link.
- A quoted example of bad authority language.

### 4. Repeated sentence starts

Source files:

- `rule-libraries/derived/high-confidence-candidates.json`
- `writing-corpora/derived/rule-and-fixture-candidates.json`

Signals:

- adjacent sentences start with the same first token
- adjacent sentences start with the same first two tokens
- low sentence-start variety in a paragraph

Recommended implementation:

- Existing family: `syntactic-patterns/repetition`.
- Better rule name: `repeated-sentence-starts`.
- Report adjacent repetition only after a threshold, such as three adjacent starts with the same two-token prefix.
- Reuse current sentence extraction.

Why next:

- It catches a rhythm issue that current `triple-repeat` only partially covers.
- It is deterministic.
- It complements action-density and flat-cadence rules.

Risks:

- Rhetorical anaphora can be intentional.
- Children's prose can use repeated starts deliberately.

Required no-hit controls:

- A quoted speech with deliberate rhetorical repetition.
- A list-like paragraph with repeated labels that should be handled by Markdown structure, not prose rhythm.

## Useful But Not First

### Mechanical bold list lead-ins

Signals:

- `- **Performance:** ...`
- `- ✅ **Done:** ...`

Reason not first:

- Many technical docs intentionally use this as definition-list style.
- It needs a profile or document-type decision.

### Passive voice with by-agent

Signals:

- `was finalized by the team`
- `was caused by a typo`

Reason not first:

- A narrow by-agent version is implementable, but it is not specifically slop.
- Scientific, incident, legal, and technical prose use passive voice legitimately.
- This should be warning-level or profile-specific if implemented.

### Vague quantifiers

Signals:

- `some`
- `many`
- `a few`
- `a lot of`

Reason not first:

- Single quantifiers are too broad.
- Useful implementation needs nearby missing number, date, measurement, or concrete noun checks.
- This is more architecture than one bounded rule.

### Broad AI vocabulary

Signals:

- `delve`
- `tapestry`
- `robust`
- `seamless`
- `nuanced`
- `comprehensive`
- `vital`

Reason not first:

- High false-positive risk as standalone word rules.
- Useful only as density features combined with generic claims, no numbers, and formal transition overuse.

### Grammar and simplification corpora

Sources:

- BEA-2019
- CLC FCE
- NUCLE
- JFLEG
- ASSET
- WikiSplit

Reason not first:

- These are grammar, learner-English, simplification, or fluency resources.
- They are useful for no-hit fixtures and metrics calibration, not default Slopless rules.

## Current Recommendation

Implement in this order:

1. `markdown-layout` artifact rules
2. `formal-transition-density`
3. `uncited-authority`
4. `repeated-sentence-starts`

Continue with Markdown artifact rules next.
