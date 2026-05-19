# Initial expansion ideas

This is a first-pass analysis of the generated fresh corpus. It is not fixture approval and it does not change rule behavior.

## Mechanical run

- Command: `node dist/cli.js "new-corpus/2026-05-19-fresh-slop-expansion/**/*.md"`
- Files scanned: 29
- Findings: 1176

## Top current catches

- slopless/triple-repeat: 297
- slopless/negation-reframe: 239
- slopless/paragraph-length: 152
- slopless/prohibited-words: 81
- slopless/repeated-sentence-starts: 69
- slopless/demonstrative-emphasis: 65
- slopless/word-repetition: 42
- slopless/semantic-thinness: 30
- slopless/llm-vocabulary: 28
- slopless/fragment-stacking: 24
- slopless/perception-verb-density: 21
- slopless/generic-signposting: 19
- slopless/contrastive-aphorism: 16
- slopless/sentence-case: 10
- slopless/body-action-density: 10
- slopless/flesch-kincaid: 8
- slopless/gunning-fog: 7
- slopless/flat-action-cadence: 7
- slopless/coleman-liau: 6
- slopless/uncomparables: 6

## High-signal misses

- `semantic-thinness` intended hit cases produced only a small number of direct semantic-thinness findings. Many lines were caught only through `negation-reframe`, which means the semantic templates remain too narrow for fresh abstract slop.
- `narrative-slop` intended hit cases produced almost no direct narrative findings, while the long fiction text produced many narrative findings. The density rules work on flowing prose but compact case lines do not reliably trigger them.
- `orthography` intended hit cases produced almost no direct orthography findings. The generated cases likely described artifacts instead of containing the exact punctuation or placeholder forms. This corpus should be reviewed before fixture migration.
- `academic-slop` intended hits mostly fell through to broad vocabulary rules. The tortured-phrase rule is too literal or the generated cases are not close enough to the existing phrase list.
- `term-policy` intended hits did not meaningfully exercise active configured terms. This family needs project-specific config examples before broad corpus generation is useful.

## No-hit pressure

- `no-hits/words.md` produced findings for isolated words such as `seamless`, `robust`, `comprehensive`, `landscape`, and `unlock`. This confirms the existing one-to-one vocabulary rules are intentionally harsh and need domain-specific no-hit review before any further broad word expansion.
- `no-hits/syntactic-patterns.md` produced several `negation-reframe` findings on factual correction and quoted-example lines. The next widening pass should not broaden negation until quote/example and factual-correction guards are improved.
- `README.md` itself produced findings, mostly readability and heading style. The generated corpus root should probably be excluded from future mining commands or written in fixture-safe prose.

## Likely existing-rule expansion targets

- Semantic thinness: expand abstract-personification, deictic-summary, point-is, vague-payoff, and business-lesson frames using the new hit cases as candidate material. Add no-hit controls first.
- Syntactic patterns: improve negation-reframe guards for factual correction, literal examples, filenames, and implementation contrast before broadening.
- Narrative slop: keep density as the reporting policy, but add a case-file format that uses short paragraphs instead of single isolated sentences so density behavior is testable.
- Academic slop: mine the generated academic cases for recurring tortured-style paraphrase shapes, but compare them to existing tortured-phrase data before adding patterns.
- Orthography: regenerate artifact cases with literal artifacts and punctuation, not descriptions.
- Words: do not add more single-word one-to-one vocabulary bans until the no-hit review decides whether harsh vocabulary findings are acceptable. Prefer density.

## Next review steps

- Split Slopless output into expected hit misses and no-hit false positives by family.
- Promote only reviewed examples into `behavior/fixtures/textlint-rules/cases`.
- Generate corpus prose only after the reviewed case promotion.
