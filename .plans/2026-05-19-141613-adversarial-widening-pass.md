# Goal

Widen high-value prose slop rules aggressively while controlling false positives with adversarial no-hit cases first. The desired end state is:

- harder hit cases exist for the rule families being widened
- adversarial no-hit cases exist for the same families
- every new case line is preserved in topic-relevant corpus prose
- rules are widened by reusable slots, gates, and density groups, not by one-off exact examples
- Fixture3 output is reviewed for hit cases, no-hit cases, and old corpus changes before approval

# Approach

## 1. Add adversarial no-hit cases first

Add no-hit cases for places where broadening can go wrong:

- `semantic-thinness/no-hits.md`
  - concrete realization lines with named facts, records, measurements, and causes
  - concrete pressure and stakes lines with deadlines, money, medical cause, or measurable failure
  - literal body sensation lines caused by injury, equipment, weather, or clinical condition
  - literal gaze/search lines with a named object or observed clue
  - scene-state and transition lines with named cause or concrete state change
- `syntactic-patterns/no-hits.md`
  - factual `not X but Y`
  - ordinary `less X than Y` and `more X than Y`
  - concrete `X is not Y; it is Z`
  - normal `a/the adjective noun is...` where the noun is a real object, role, or document
  - ordinary contrast pairs with measurements, medical dosing, dashboard exports, or documented evidence
- `narrative-slop/no-hits.md`
  - movement chains with concrete task goals
  - body and posture words with medical, stage, sport, or equipment causes
  - perception verbs used to inspect, count, search, measure, or record concrete evidence
  - short-sentence young-reader pacing with clear causal or task content

## 2. Add adversarial hit cases

Add harder positive cases that are real slop but less literal:

- `semantic-thinness/hits.md`
  - realization, stakes, body sensation, gaze, scene-state, and transition slop embedded inside longer sentences
  - empty `that is where/when/how` interpretive frames
  - atmosphere and importance lines with no concrete cause
- `syntactic-patterns/hits.md`
  - same-sentence contrast slogans
  - `less X than Y` and `more X than Y` slogans
  - `the/a/this adjective frame noun is...` generic signposting
  - broader `instead/rather` negation pivots
- `narrative-slop/hits.md`
  - clause-chain action cadence
  - expanded body-action density
  - expanded perception density

## 3. Preserve cases in corpus prose

Add each new line to a readable topic-relevant corpus file:

- semantic and syntactic product/content cases go into `engineering-review.md`
- health/medical controls go into `health-and-parenting.md`
- fiction and movement cases go into `narrative-scenes.md`

Update matching `*.preserve.json` files so `scripts/verify-corpus-preserve.py` can prove every case line exists in the corpus.

## 4. Widen rules

Widen existing rules only:

- `semantic-thinness`
  - switch selected patterns from `full` to `contains` where the existing concrete guards can control false positives
  - expand slots for realization, stakes, body-emotion shorthand, gaze choreography, empty-scene state, and empty-scene transition
  - keep concrete evidence rejection active for broad patterns
- `syntactic-patterns:generic-signposting`
  - expand frame subjects from `the` to `a/an/this/that`
  - expand frame nouns to `approach`, `strategy`, `plan`, `fix`, `path`, `choice`, `tradeoff`, `focus`, `priority`, and `principle`
  - add noun-predicate frames like `the fix is boring`, constrained to solution-like nouns
- `syntactic-patterns:contrastive-aphorism`
  - add same-sentence slogan contrast frames: `not X but Y`, `less X than Y`, `more X than Y`, and `not X; it is Y`
  - keep abstract-subject/object gates for paired contrast
- `syntactic-patterns:negation-reframe`
  - expand replacement verbs for `did not X. Instead/Rather, Y` patterns
- `narrative-slop:flat-action-cadence`
  - detect comma/connector clause chains in addition to adjacent sentences
  - expand weak action verbs conservatively but broadly
- `narrative-slop:body-action-density`
  - expand body, posture, breath, jaw, throat, pulse, spine, skin, and micro-action cues
  - keep density reporting rather than one-to-one reporting
- `narrative-slop:perception-verb-density`
  - add `scan`, `peer`, `squint`, `study`, `notice`, `see`, and `saw`
  - keep purpose-look guards

## 5. Verify and analyze

Run:

- `scripts/verify-adversarial-widening.py`
- `scripts/fixture3.sh check --suite textlint-rules`
- review `.fixture3/textlint-rules/diff.txt`
- `scripts/fixture3.sh approve --suite textlint-rules` only after reviewing changes
- `scripts/fixture3.sh check --suite textlint-rules`
- `scripts/verify-all.sh`
- `npm run validate`

Analyze:

- added findings in hit cases
- any findings in no-hit cases
- added and removed findings in existing corpus files
- whether false positives need rule narrowing or case reclassification

# Key Decisions

- Do not add a new family. This pass widens existing rules.
- Do not implement broad AI vocabulary as standalone hits.
- Do not widen Markdown-layout artifacts in this pass.
- Use density gates for repeated body, perception, and action cues. Do not report single body or movement cues as slop.
- Prefer false-positive exposure over hidden caution. The no-hit corpus should be adversarial enough to show where broadening breaks.

# Files To Modify

- `behavior/fixtures/textlint-rules/cases/semantic-thinness/hits.md`
- `behavior/fixtures/textlint-rules/cases/semantic-thinness/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/hits.md`
- `behavior/fixtures/textlint-rules/cases/syntactic-patterns/no-hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/hits.md`
- `behavior/fixtures/textlint-rules/cases/narrative-slop/no-hits.md`
- `behavior/fixtures/textlint-rules/corpus/engineering-review.md`
- `behavior/fixtures/textlint-rules/corpus/engineering-review.preserve.json`
- `behavior/fixtures/textlint-rules/corpus/health-and-parenting.md`
- `behavior/fixtures/textlint-rules/corpus/health-and-parenting.preserve.json`
- `behavior/fixtures/textlint-rules/corpus/narrative-scenes.md`
- `behavior/fixtures/textlint-rules/corpus/narrative-scenes.preserve.json`
- `src/rules/semantic-thinness/patterns/body-emotion-shorthand.json`
- `src/rules/semantic-thinness/patterns/empty-scene-state.json`
- `src/rules/semantic-thinness/patterns/empty-scene-transition.json`
- `src/rules/semantic-thinness/patterns/gaze-choreography.json`
- `src/rules/semantic-thinness/patterns/generic-pressure-or-stakes.json`
- `src/rules/semantic-thinness/patterns/generic-realization.json`
- `src/rules/syntactic-patterns/lead-ins/generic-signposting.ts`
- `src/rules/syntactic-patterns/contrast/contrastive-aphorism.ts`
- `src/rules/syntactic-patterns/contrast/private/negative-slop-frames.ts`
- `src/rules/narrative-slop/body-action-density.ts`
- `src/rules/narrative-slop/perception-verb-density.ts`
- `src/rules/narrative-slop/flat-action-cadence.ts`
- `scripts/verify-adversarial-widening.py`
- `scripts/verify-all.sh`
