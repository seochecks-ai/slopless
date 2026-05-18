# Goal

Prototype a local sentence scorer for prose heuristics using `BAAI/bge-small-en-v1.5` as the first encoder.

The model should produce separate sentence-level scores, not one combined "slop" label.

Initial score axes:

- specificity
- vagueness
- informativeness
- boilerplate/formulaicness
- grounding, from lexical score tables first

Runtime target:

- local only
- no network calls
- one article in seconds
- package/model artifacts in the low hundreds of MB or less for the first prototype

# Key Decision

Use `BAAI/bge-small-en-v1.5` first.

Reasons:

- measured local ONNX snapshot size: 127.8 MB
- measured local CPU speed on this machine: about 330-380 sentences/sec at batch sizes 8-64
- standard BERT-style architecture
- existing ONNX artifact
- simpler than Voyage-4-nano for export, tuning, and runtime

Do not start with Voyage-4-nano.

Reasons:

- measured q4 ONNX snapshot size: 240.7 MB
- measured local CPU speed on this machine: about 38-44 sentences/sec
- custom Qwen3-style bidirectional implementation
- better retrieval benchmarks do not prove better specificity/vagueness/informativeness scores

Keep Voyage-4-nano as a later comparison if BGE-small quality fails.

# Model Shape

Prototype shape:

```text
sentence
-> bge-small encoder
-> pooled sentence vector
-> separate heads
-> separate scores
```

Heads:

```text
specificity_head: regression 0..1
vagueness_head: regression or ordinal classification
informativeness_head: regression 0..1
boilerplate_head: binary or probability
```

Grounding should not be a neural head first.

Grounding should start as deterministic lexical scoring from Lancaster and Brysbaert:

```text
sentence
-> content words
-> concreteness/sensorimotor lookup
-> groundedness score
```

This keeps the first model focused on axes with human sentence labels.

# Training Strategy

## Phase 1: Frozen Encoder Baseline

Purpose:

- test whether existing labels are usable
- test whether BGE-small embeddings carry enough information for each axis
- establish simple metrics before fine-tuning

Train only heads:

```text
BGE-small vectors fixed
heads trained on existing labels
```

Candidate head types:

- LightGBM
- logistic regression
- ridge regression
- small MLP

Expected cost:

- training: minutes
- inference: dominated by BGE-small encoder

## Phase 2: Multi-Task Fine-Tune

Run only if Phase 1 is promising.

Shape:

```text
BGE-small encoder + multiple heads
```

Training:

- update encoder and heads
- use a low learning rate for encoder
- use per-dataset masked losses
- do not require every sentence to have every label

Loss shape:

```text
loss =
  specificity_loss when specificity label exists
  + vagueness_loss when vagueness label exists
  + informativeness_loss when informativeness label exists
  + boilerplate_loss when boilerplate label exists
```

Reason:

- specificity, vagueness, informativeness, and boilerplate are separate targets
- shared encoder can learn useful text representations for all axes
- separate heads keep outputs interpretable

## Phase 3: Runtime Export

Export:

- ONNX model
- tokenizer files
- metadata with score names and calibration

Quantize only after quality is measured:

- fp32 baseline
- int8 export
- benchmark speed and output drift

# Existing Datasets

Local source cache:

```text
legacy/plans-source-material/2026-05-13-132611-semantic-thinness/
```

## Specificity

Primary files:

```text
specificity/domain-agnostic/dataset-data/data.txt
specificity/domain-agnostic/dataset-data/label.txt
specificity/domain-agnostic/dataset-data/twitters.txt
specificity/domain-agnostic/dataset-data/twitterv.txt
specificity/domain-agnostic/dataset-data/movies.txt
specificity/domain-agnostic/dataset-data/moviev.txt
specificity/domain-agnostic/dataset-data/yelps.txt
specificity/domain-agnostic/dataset-data/yelpv.txt
```

Labels:

- news: binary general/specific
- Twitter/Yelp/Movie: real-valued specificity from human 1-5 ratings rescaled to 0..1

Use:

- train `specificity_head`
- evaluate by domain
- keep news binary labels separate from real-valued target-domain labels

Initial label transform:

- use real-valued labels directly for Twitter/Yelp/Movie
- map news binary labels to 0/1 only for a separate binary auxiliary loss
- avoid merging binary and real-valued labels blindly

## Vagueness

Primary files:

```text
vagueness/vagueness_data/vagueness_dataset.json
vagueness/vagueness_data/Privacy_Sentences.txt
```

Labels:

- sentence vagueness: five human scores from 1 to 5
- phrase vagueness: terms selected by annotators

Use:

- train `vagueness_head`
- use phrase annotations as additional features or auxiliary labels

Initial label transform:

- average sentence scores
- normalize to 0..1
- keep phrase-hit counts as optional feature:
  - count of vague phrases
  - max annotator agreement
  - any phrase selected by at least 2 annotators

Risk:

- domain is privacy policies
- model may learn legal/privacy vocabulary

Mitigation:

- evaluate separately on non-policy prose
- add LLM-labeled prose samples for generalization

## Informativeness

Source to add:

```text
squinky==0.1.0
SQUINKY sentence corpus
```

Labels:

- 7,032 sentences
- formality, informativeness, implicature
- human ratings on 1-7 scale

Use:

- train `informativeness_head`
- optional `implicature` can become a separate later axis

Initial label transform:

- normalize informativeness rating to 0..1
- keep formality and implicature as optional secondary targets

Action:

- download the actual SQUINKY corpus, not only the Python package
- inspect the CSV fields and label distribution before training

## Boilerplate / Formulaicness

Existing source:

- `maifeng/boilerplate_detection` model card and method

Problem:

- model is finance-domain-specific
- data itself is not in local cache

Use:

- copy the labeling idea, not the model

Labeling idea:

- repeated segment frequency is a boilerplate signal
- positives: segments repeated across many documents in the same source family
- negatives: segments with low or no repetition

Prototype data sources:

- generated fixtures
- scraped/generated article corpora already in repo if available
- public prose corpora if easy to fetch

Do not make this a first required head if no usable dataset is ready.

## Grounding

Primary files:

```text
lancaster/Lancaster_sensorimotor_norms_for_39707_words.csv
concreteness/huggingface/concreteness_ratings.csv
```

Labels:

- word-level sensorimotor scores
- word-level concreteness scores

Use:

- deterministic sentence feature, not neural head first

Sentence features:

- mean content-word concreteness
- minimum/maximum concreteness
- fraction of high-concrete words
- fraction of low-concrete words
- mean sensorimotor strength
- max visual/haptic/action strength

Reason:

- the data is already a score table
- no sentence labels are needed for first grounding score

# LLM Label Enrichment

Use LLM labeling to extend existing labeled datasets, not replace them.

Use structured outputs with a JSON Schema. OpenAI docs state that Structured Outputs enforce schema adherence and are available in current large models starting with GPT-4o-class models. The Responses API supports structured output via `text.format`, and the docs recommend Structured Outputs over JSON mode when available.

Official reference:

- `https://developers.openai.com/api/docs/guides/structured-outputs`

## Labeling Principles

Each labeling task must be narrow.

Good:

- "Rate sentence specificity from 0 to 1 using these examples."
- "Rate vagueness from 0 to 1 and mark vague spans."
- "Rate informativeness from 0 to 1."

Bad:

- "Is this AI slop?"
- "Is this bad writing?"
- "Is this semantically thin?"

Reason:

- narrow labels can be checked against existing human-labeled datasets
- broad labels collapse several concepts and become unstable

## Bootstrapping Prompt Inputs

For each axis, provide:

- short task definition
- 10-30 high-confidence positive examples from existing labeled data
- 10-30 high-confidence negative examples from existing labeled data
- boundary examples near the middle of the scale
- explicit scoring rubric
- required JSON schema

Example axes:

- specificity:
  - seed from Domain-Agnostic Specificity high/low labels
- vagueness:
  - seed from Lebanoff high/low sentence scores and vague spans
- informativeness:
  - seed from SQUINKY high/low informativeness scores

## Output Schema

One JSON object per sentence:

```json
{
  "sentence_id": "string",
  "axis": "specificity",
  "score": 0.0,
  "confidence": 0.0,
  "label": "low",
  "evidence_spans": [
    {
      "text": "string",
      "reason": "string"
    }
  ],
  "rationale_short": "string",
  "needs_review": false
}
```

For vagueness, add:

```json
{
  "vague_spans": [
    {
      "text": "string",
      "kind": "modal|quantifier|generic_referent|abstract_term|other"
    }
  ]
}
```

Use `rationale_short` only for audit and prompt repair. Do not train on rationales first.

## Labeling Workflow

1. Calibrate prompt on existing labeled test split.
2. Compare LLM labels to human labels.
3. Revise rubric until agreement is acceptable.
4. Label a small new batch.
5. Human-review disagreements and low-confidence outputs.
6. Expand to tens of thousands of labels only after calibration passes.

Agreement checks:

- specificity: correlation with human scores
- vagueness: correlation with sentence score and overlap with vague spans
- informativeness: correlation with SQUINKY score
- binary buckets: precision/recall on high/low extremes

## Active Learning Loop

Use the local model to choose sentences for LLM labeling:

- high uncertainty
- disagreement between heads
- domain outside existing datasets
- high model score but low heuristic signal
- low model score but high heuristic signal

This avoids paying for easy labels.

## Synthetic Data

Use synthetic generation only for contrast pairs and stress tests.

Examples:

- low specificity -> high specificity rewrite
- vague -> concrete rewrite
- low informativeness -> high informativeness rewrite

Do not train heavily on synthetic positives without real or LLM-reviewed negatives.

Reason:

- synthetic data can teach model-specific phrasing artifacts
- contrast pairs are useful for calibration and tests

# Evaluation

Per-axis metrics:

- specificity:
  - Spearman correlation
  - Pearson correlation
  - mean absolute error
  - high/low bucket accuracy
- vagueness:
  - Spearman correlation
  - mean absolute error
  - high-vagueness precision
  - vague span overlap if spans are used
- informativeness:
  - Spearman correlation
  - mean absolute error
  - high/low bucket accuracy
- boilerplate:
  - precision
  - recall
  - false positive review

Runtime metrics:

- model artifact size
- tokenizer size
- package overhead
- sentences/sec at batch sizes 1, 8, 32, 64
- article runtime on representative fixtures
- CPU memory use

Textlint-facing metrics:

- number of sentence scores emitted
- number of findings after threshold rules
- false positives on no-signal fixtures
- comparison with existing heuristic findings

# Prototype Deliverables

No textlint rule should depend on this until the scorer passes evaluation.

Prototype outputs:

```text
sentence_id
text
specificity_score
vagueness_score
informativeness_score
grounding_score
boilerplate_score, if available
model_version
```

Store outputs as JSONL for fixture review.

Do not wire into presets or rule registries in the prototype.

# Open Questions

- Whether BGE-small head-only quality is enough for specificity, vagueness, and informativeness.
- Whether multi-task fine-tuning improves enough to justify export complexity.
- Whether SQUINKY corpus download is still available in a clean original form.
- Whether LLM labels match existing human labels closely enough for augmentation.
- Whether model inference should live inside `packages/textlint-rules` or behind a separate scorer package.

# Immediate Next Steps

1. Download and inventory SQUINKY corpus.
2. Build a dataset manifest:
   - source file
   - axis
   - label type
   - split
   - transform
3. Build a small training spike:
   - BGE-small ONNX/PyTorch embedding extraction
   - frozen head-only models
   - per-axis metrics
4. Build one structured-output labeling prompt for specificity.
5. Test the LLM prompt against existing specificity labels before generating new labels.

# Verification For This Plan

Done:

- confirmed local source cache exists
- confirmed BGE-small ONNX CPU benchmark from local run
- confirmed Voyage-4-nano ONNX CPU benchmark from local run
- checked OpenAI Structured Outputs docs for schema-constrained labeling output

No code was changed.
