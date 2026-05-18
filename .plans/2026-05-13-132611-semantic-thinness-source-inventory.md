# Goal

Design the first `semantic-thinness` rule slice for `packages/textlint-rules` from downloaded source material, not invented sentence lists.

The immediate output is an inventory and rule-design plan. No runtime rule code is changed in this pass.

# Source Cache

Local cache:

```text
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/
```

This cache is research material only. It is not package data and should not be imported by runtime code directly.

# Downloaded Sources

## Lancaster Sensorimotor Norms

Files:

```text
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/lancaster/Lancaster_sensorimotor_norms_for_39707_words.csv
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/lancaster/osf-files.tsv
```

Source:

- `https://osf.io/download/48wsc/`
- `https://osf.io/rwhs6/`
- `https://www.lancaster.ac.uk/psychology/lsnorms/`

License:

- CC-BY 4.0.
- Shippable if attribution is included.

Shape:

- 39,707 CSV lines.
- Word-level norms.
- Useful columns:
  - `Word`
  - `Auditory.mean`
  - `Gustatory.mean`
  - `Haptic.mean`
  - `Interoceptive.mean`
  - `Olfactory.mean`
  - `Visual.mean`
  - `Foot_leg.mean`
  - `Hand_arm.mean`
  - `Head.mean`
  - `Mouth.mean`
  - `Torso.mean`
  - `Max_strength.sensorimotor`
  - `Minkowski3.sensorimotor`
  - `Dominant.sensorimotor`
  - `Percent_known.perceptual`
  - `Percent_known.action`

What we can use:

- Primary source for concrete grounding.
- Derive compact runtime data:
  - low-grounding terms
  - high-grounding terms
  - visual/haptic/action anchor terms
  - body/action verbs and nouns

What not to do:

- Do not ship the full CSV blindly in the textlint package.
- Do not treat one low score as a finding by itself. Use scores as a slot feature inside a frame.

## Lebanoff/Liu Vagueness Dataset

Files:

```text
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/vagueness/vagueness_data.tar.gz
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/vagueness/vagueness_data/LICENSE.md
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/vagueness/vagueness_data/Privacy_Sentences.txt
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/vagueness/vagueness_data/README.txt
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/vagueness/vagueness_data/vagueness_dataset.json
```

Source:

- `https://loganlebanoff.github.io/mydata/vagueness_data.tar.gz`
- `https://aclanthology.org/D18-1387/`

License:

- BSD.
- Shippable after attribution.

Shape:

- 99 documents.
- 4,499 annotated vague sentences.
- 20,513 phrase annotations.
- `Privacy_Sentences.txt` has 108,086 lines.
- Each annotated sentence has:
  - `sentence_str`
  - `vague_phrases`
  - five sentence vagueness scores from 1 to 5

Top mined phrase signals from the local copy:

```text
may
personal information
information
other
some
certain
third parties
third party
personally identifiable information
time to time
generally
most
services
third-party
such as
personal data
others
general
might
may be
many
various
necessary
appropriate
reasonably
typically
similar
usually
```

What we can use:

- Seed vague quantifier/modality/predicate lists.
- Mine "vague phrase in vague sentence" candidates.
- Use sentence scores for offline review ordering.

What not to do:

- Do not import the top phrase list as a rule. It is privacy-policy biased.
- Do not let `may`, `information`, `services`, or `third party` become standalone prose findings.
- Use this as candidate generation, not as final rule data.

## Domain-Agnostic Sentence Specificity Data

Files:

```text
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/specificity/domain-agnostic/README.md
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/specificity/domain-agnostic/dataset-data/
```

Downloaded data files:

```text
data.txt
label.txt
movies.txt
moviev.txt
moviel.txt
movieu.txt
twitters.txt
twitterv.txt
twitterl.txt
twitteru.txt
yelps.txt
yelpv.txt
yelpl.txt
yelpu.txt
```

Source:

- `https://github.com/wjko2/Domain-Agnostic-Sentence-Specificity-Prediction`

License:

- No license file found in the downloaded repository content.
- Do not ship copied data unless license is resolved.

Shape:

- News:
  - `data.txt`: 4,342 sentences.
  - `label.txt`: 4,342 binary labels.
- Twitter:
  - `twitters.txt`: 984 sentences.
  - `twitterv.txt`: 984 real-valued specificity scores.
  - `twitterl.txt`: 984 binary labels.
  - `twitteru.txt`: 50,000 unlabeled sentences.
- Movies:
  - `movies.txt`: 920 sentences.
  - `moviev.txt`: 920 real-valued specificity scores.
  - `moviel.txt`: 920 binary labels.
  - `movieu.txt`: 11,855 unlabeled sentences.
- Yelp:
  - `yelps.txt`: 845 sentences.
  - `yelpv.txt`: 845 real-valued specificity scores.
  - `yelpl.txt`: 845 binary labels.
  - `yelpu.txt`: 95,650 unlabeled sentences.

What we can use:

- Offline calibration for "low specificity" signals.
- Compare our candidate thin sentences against human specificity scores.
- Use only derived thresholds or observations unless license is resolved.

What not to do:

- Do not vendor the sentence data into package data yet.
- Do not add a PyTorch specificity predictor to textlint runtime.

## Speciteller

Files:

```text
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/specificity/speciteller/speciteller-master.zip
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/specificity/speciteller/speciteller-master/
```

Source:

- `https://github.com/jjessyli/speciteller`
- `https://www.cis.upenn.edu/~nlp/software/speciteller.html`

License:

- Project page says the full package is CC BY-NC-SA 3.0.
- Do not ship copied runtime data or code.

Shape:

- Python code.
- Small model files in `cotraining_models`.
- README says external word lexicons are required for full feature extraction.
- External tarball URL from the older site now returns a Penn 404.

What we can use:

- Read feature ideas only.
- Use as a check on which signals specificity systems found useful.

What not to do:

- Do not run this in textlint.
- Do not port code.
- Do not ship model files.

## Brysbaert Concreteness Via Hugging Face Mirror

Files:

```text
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/concreteness/huggingface/concreteness_ratings.csv
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/concreteness/huggingface/README.md
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/concreteness/huggingface/api.json
```

Source:

- `https://huggingface.co/datasets/StephanAkkerman/concreteness-ratings`
- Mirror README points to `https://osf.io/kj76e/`.

License:

- Hugging Face mirror declares MIT.
- Original Brysbaert data has separate licensing concerns. Treat as unresolved for shipping until original license is checked.

Shape:

- 39,955 CSV lines.
- Columns:
  - `Word`
  - `Bigram`
  - `Conc.M`
  - `Conc.SD`
  - `Unknown`
  - `Total`
  - `Percent_known`
  - `SUBTLEX`
  - `Dom_Pos`

What we can use:

- Offline comparison against Lancaster.
- If license is resolved, derive abstract/concrete slot lists.

What not to do:

- Do not ship this mirror as package data until original license is resolved.
- Prefer Lancaster for runtime grounding because Lancaster is clearly CC-BY 4.0 and has richer dimensions.

## Wiktionary Light Verb Category

Files:

```text
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/light-verbs/wiktionary/categorymembers.json
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/light-verbs/wiktionary/members.txt
```

Source:

- `https://en.wiktionary.org/wiki/Category:English_light_verb_constructions`
- MediaWiki API category query.

License:

- Wiktionary content is CC BY-SA/GFDL.
- Do not vendor raw list into package data without accepting share-alike obligations.

Shape:

- 339 member lines from the API.
- Very noisy for our purpose.
- Examples include idioms and fixed expressions:
  - `break a leg`
  - `break the ice`
  - `come true`
  - `do the math`
  - `get dressed`

What we can use:

- Manual inspiration for light-verb categories.
- Not a runtime data source.

What not to do:

- Do not use this as a light-verb rule list.
- Do not treat all members as semantic thinness. Many are idioms or concrete actions.

# Proposed Runtime Data

Runtime should use derived, reviewed JSON only.

Do not import raw research files from `legacy/plans-source-material`.

Candidate data files:

```text
packages/textlint-rules/src/families/semantic-thinness/data/grounding-thresholds.json
packages/textlint-rules/src/families/semantic-thinness/data/semantic-slots.json
packages/textlint-rules/src/families/semantic-thinness/data/source-attribution.json
```

`grounding-thresholds.json`:

- license-clean source: Lancaster.
- compact score buckets, not full rows.
- likely fields:
  - `word`
  - `sensorimotor`
  - `visual`
  - `haptic`
  - `action`
  - `dominant`

`semantic-slots.json`:

- reviewed terms only.
- likely groups:
  - `deicticSubjects`
  - `genericSubjects`
  - `abstractSubjects`
  - `vagueChangeVerbs`
  - `emptyStateAdjectives`
  - `weakPostureVerbs`
  - `bleachedMetaphorVerbs`
  - `concreteAnchorPrepositions`
  - `concreteExceptionTerms`

`source-attribution.json`:

- cite Lancaster and Lebanoff if any derived data is used.
- keep original source names and URLs near derived data.

# Proposed Rule Mechanics

Keep mechanics local to `semantic-thinness` first.

Candidate files:

```text
packages/textlint-rules/src/families/semantic-thinness/private/frame-matcher.ts
packages/textlint-rules/src/families/semantic-thinness/private/grounding.ts
packages/textlint-rules/src/families/semantic-thinness/private/semantic-slots.ts
```

Allowed shared imports:

- `shared/text/*`
- `shared/matchers/prose-patterns.ts` only for neutral token helpers if needed.

Do not add `shared/matchers/semantic-primitives.ts` yet. The previous boundary decision says semantic-thinness matchers stay local until reuse is proven.

# First Rule Candidates

## `empty-scene-transition`

Examples:

```text
Everything shifted.
The moment passed.
The room changed after that.
It changed everything.
```

Frame:

```text
generic/deictic subject + vague change verb + no concrete cause/result
```

Useful source features:

- vague change verbs: derived by review, checked against Lebanoff vague phrase seeds.
- concrete cause/result absence: Lancaster high-grounding words and named/number/date checks.

Why first:

- Smallest frame.
- Existing handoff already describes this shape.
- Clear negative boundary:
  - `Everything shifted after the new tax rule took effect.`
  - `The scene changed when the camera cut to the exterior courtyard.`

## `empty-stage-setting`

Examples:

```text
The yard was empty.
The room felt still.
The air felt heavy.
```

Frame:

```text
place noun + copula/feel verb + empty state adjective + no concrete detail nearby
```

Useful source features:

- concrete place nouns from Lancaster.
- empty state adjectives from reviewed local slots.
- no concrete detail from high visual/haptic/action terms.

Risk:

- Fiction can legitimately use quiet scene state.
- Needs a narrow first version.

## `abstract-metaphor-claim`

Examples:

```text
Prevention lives in rehearsal.
The answer lives in consistency.
Trust sits inside repair.
```

Frame:

```text
abstract subject + spatial/body/metaphoric verb + abstract prepositional complement
```

Useful source features:

- low-grounding abstract nouns from Lancaster.
- high-grounding verbs used metaphorically.
- abstract complement check from Lancaster low grounding.

Risk:

- Some editorial prose intentionally uses metaphor.
- Needs strong frame evidence, not just abstract words.

## `low-info-physical-blocking`

Examples:

```text
They just stood there.
She looked around.
He sat with it.
```

Frame:

```text
human subject + weak posture/perception verb + vague locative/complement only
```

Useful source features:

- body/action verbs from Lancaster.
- vague locatives from reviewed slots.

Risk:

- Narrative prose may need small physical beats.
- Better after `empty-scene-transition`.

# Minimal First Slice

Start with `empty-scene-transition`.

Reasons:

- It requires the least grammar machinery.
- It can use existing sentence tokens.
- It tests the core semantic-thinness idea: report only when a sentence has a vague frame and lacks concrete anchors.
- It does not require POS tagging yet.

Expected implementation shape:

```text
sentence tokens
-> detect generic/deictic subject
-> detect vague change predicate
-> reject if concrete cause/result appears
-> report the sentence span
```

No NLP dependency is needed for this first slice.

# Dependency Position

Do not add `compromise` or `wink-nlp` yet.

Current textlint package already has enough for the first slice:

- textlint AST
- sentence splitting
- word tokenization
- normalized token helpers
- source offset mapping

Add NLP only if a later rule needs reliable noun phrase or verb lemma detection and the rule cannot stay deterministic with local slots.

# Open Decisions

- Whether derived Lancaster data should be stored as score buckets or named slot lists.
- Whether to use Lebanoff only for mining, or also to ship a tiny reviewed vague phrase seed list with BSD attribution.
- Whether concreteness data is needed at all if Lancaster covers enough abstract/concrete separation.
- Whether `empty-stage-setting` belongs in general prose checks or needs a fiction-specific boundary later. Presets are out of scope here; the rule still needs a clean standalone boundary.

# Verification For This Planning Pass

Completed:

- Downloaded source files.
- Checked row counts and headers.
- Checked local licenses where available.
- Confirmed no existing Lancaster/Brysbaert/Lebanoff data is already present under `packages/textlint-rules`.

No code was changed.
