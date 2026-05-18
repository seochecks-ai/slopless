# Sunstone Slop Cases

State: mixed implementation record.

Source: user-supplied Sunstone prose cases on 2026-05-17.

Purpose: classify every supplied case into generalized rule-design groups so later rule work can add cases, no-hit controls, corpus prose, and implementation.

Implemented examples were moved to `data/source-material/incorporation-record.md`.

The remaining notes in this file are source context only. They are not queued as active implementation candidates unless a future plan creates bounded templates and fixtures for them.

## Negation Reframe And Contrast Pivot

Likely family: `syntactic-patterns/contrast`.

Implementation: moved to `data/source-material/incorporation-record.md`.

Generalized catch:

- `subject did not X. subject went/did Y.`
- `subject was not just X. subject/they Y.`
- `no longer just X. now Y.`
- `not X. it is Y.`
- `didn't X. instead, subject Y.`

Notes:

- The existing negation-reframe rule should cover some of these, but this set suggests wider surface forms: contractions, `no longer`, `not just`, and `instead`.
- Single-sentence negation can be normal. The safest target is the paired contrast pivot, not every negative clause.

## Scene Silence And Atmosphere Shift

Likely family: `semantic-thinness` or `narrative-slop`.

Generalized catch:

- `place/air/market felt different now`
- `silence felt heavy`
- `X went silent`
- `not a single word left his mouth`
- `abstract state hung heavy in the air`

Examples:

- `The yard went silent. The other cubs stopped their practice.`
- `The market felt different now.`
- `Cassia woke to a silence that felt heavy`
- `the air felt different now`
- `Not a single word left his mouth.`
- `The adult dismissal still hung heavy in the air around her.`

Notes:

- This should not catch concrete sensory change by itself.
- Good no-hit controls need real environmental changes: weather, light, sound, crowd movement, machinery stopping.

## Body Reaction As Emotion Shortcut

Likely family: `narrative-slop`.

Generalized catch:

- `character's stomach tightened`
- `character's chest felt tight`
- `heart/chest beating/thumping`
- `ears twitched`
- `felt a sudden, sharp/heavy X`
- object in pocket/body part `felt like` an intense metaphor

Examples:

- `Cassia's stomach tightened.`
- `She walked down the entire street, her heart beating a fast, steady rhythm.`
- `Cassia froze. The chalk in her pocket felt like a burning coal.`
- `their hearts thumping in unison.`
- `She felt a sudden, sharp clarity`
- `Her chest felt a sudden, heavy thump. She stared at the badge and then at the ground.`
- `Cassia's ears twitched.`
- `Cassia's chest felt tight.`

Notes:

- This category should probably be density-based or phrase-cluster-based, not a hard ban on one body cue.
- Animal-character fiction makes ears/tails/paws normal, so single mentions need no-hit controls.

## Looking Watching Gazing Density

Likely family: `narrative-slop`.

Implementation: moved to `data/source-material/incorporation-record.md`.

Generalized catch:

- high density of `look/looked/looking/watch/watched/gaze/stare` in a short span
- reciprocal looking choreography: `X looked at Y. Y was already looking back`
- `looked at X, then back at Y`

Notes:

- This should be a density rule over a paragraph or sentence window.
- It should report the repeated perception verbs, not every individual `looked`.

## Sequential Action Chains

Likely family: `syntactic-patterns/repetition` or `narrative-slop`.

Implementation: moved to `data/source-material/incorporation-record.md`.

Generalized catch:

- same subject repeated across 3 or more short clauses
- `subject verbed. subject verbed. subject verbed.`
- `they X. they Y. then they Z.`
- repeated low-information movement verbs

Notes:

- Existing repetition rules may catch opener repetition, but this needs verb-family awareness.
- Safe implementation probably needs a small closed verb family first: look/watch, step/walk/climb/crouch, stand/cross/look.

## Fixed Metaphor Frames

Likely family: `semantic-thinness` or `narrative-slop`.

Implementation: moved to `data/source-material/incorporation-record.md`.

Generalized catch:

- `A was a B of C and D`
- `X felt like a Y over a Z`
- `X hit her/him/them like a physical weight`
- `place smelled of X and Y instead of Z`
- scene noun plus overloaded abstract image stack

Notes:

- `smelled of dry tea and old hemp` may be concrete and should not automatically report.
- The safer first rule is the explicit frame `was a <metaphor noun> of <abstract/sensory noun> and <abstract/sensory noun>`.

## Abstract Stakes Escalation

Likely family: `semantic-thinness`.

Implementation: moved to `data/source-material/incorporation-record.md`.

Generalized catch:

- `they had stolen a life`
- `they were hunting the entire pack`
- `changed the game`
- `target/noise` summary contrast after a concrete mark/signal

Notes:

- These overlap with negation reframe.
- A good implementation should probably report the syntactic frame first, then add semantic-thinness patterns only for very common abstract payoff nouns.

## Empty Competence Or Group Summary

Likely family: `semantic-thinness`.

Implementation: moved to `data/source-material/incorporation-record.md`.

Generalized catch:

- `a solid front of competence and shared experience`
- abstract noun pile presented as observed fact
- `empty evaluative group summary or abstract-personification line replacing concrete behavior`

Notes:

- This needs more examples before implementation.
- The target is not any abstract noun phrase. The target is an empty evaluative group summary or abstract-personification line replacing concrete behavior.

## Straight Rhythm And Flat Sentence Cadence

Likely family: `narrative-slop` or `metrics`.

Implementation: moved to `data/source-material/incorporation-record.md`.

Generalized catch:

- 3 or more adjacent short sentences with the same simple clause shape
- `Name verb object. Pronoun verb object. Pronoun did not verb object. Possessive noun verb complement.`
- repeated sentence-initial subject plus simple past-tense verb
- long run of action beats with little causal or sensory variation

Notes:

- This is not only sentence length. The bad signal is repeated simple rhythm and repeated grammatical shape.
- A safe first implementation should probably report only dense runs with repeated subject-openers, simple past action verbs, and no conjunction/subordination variety.
- Good no-hit controls need intentionally plain prose where short sentences are used for clarity or young-reader pacing.

## Dialogue And Punctuation Artifact

Likely family: `llm-artifacts` or fixture-cleanup only.

Generalized catch:

- bracketed speaker/action artifact inside dialogue
- missing terminal punctuation after a sentence-like line

Examples:

- `"They didn't give up, Arden," [Cassia said. She looked toward the docks.] "They've changed the game."`
- `Cassia woke to a silence that felt heavy`

Notes:

- The bracketed dialogue artifact is likely detectable.
- Missing terminal punctuation is broad Markdown/prose hygiene, not slop by itself.

## Rule-Design Notes From Source

State: source context.

These notes came with the supplied examples and should guide implementation, but they are not prose cases themselves.

- `The A was a B of C and D pattern:`
- `these are fixed wordy frames, not normal technical terms.`
- `He stood, he crossed, he looked`
- `she did not X, she Y`
- `watched, looked, looking`
- `She stepped, she rested, she looked`
- `he climbed, he pulled, he walked, he crouched`
- `They X, they Y, then they Z`
- `density of looking/watching/gazing, stepping/walking/etc, ears twitching/angling/flattening`
