# Slop Source Material

Raw source files gathered for Slopless lexicons, patterns, and templates.

Implemented rule data lives under `src/rules/*`.

Implemented source records live in `incorporation-record.md`.

Research files under `derived/` must list only material that is not implemented yet.

## Inventory

- `llm-excess-vocab/berenslab`
  - Source: https://github.com/berenslab/llm-excess-vocab
  - Main file: `excess_words.csv`
  - Contents: 900 excess PubMed words with `word`, `type`, `part_of_speech`, and `comment`.
  - Possible use: word scores after filtering to style rows first.
  - Caveat: PubMed domain terms are unsafe for default prose rules.

- `llm-excess-vocab/detect-chatgpt`
  - Source: https://github.com/atsyplenkov/detect-chatgpt
  - Main file: `ges_selected_lemma.csv`
  - Contents: 983 scored lemmas plus package code that appends extra indicator words.
  - Possible use: empirical word-score source.
  - Caveat: built from academic/ChatGPT excess-word analysis, so default use needs review.

- `llm-slop-lists/slop-forensics`
  - Source: https://github.com/sam-paech/slop-forensics
  - Main files: root `slop_list*.json`, essay-domain lists, varied-prompt lists.
  - Contents: word, bigram, trigram, frequency, and phrase-count lists.
  - Possible use: direct ngram lexicons and pattern/template mining.
  - Caveat: creative-writing lists contain generated names and genre terms that should not become default words.

- `llm-slop-lists/llm-cliches`
  - Source: https://github.com/nanxstats/llm-cliches
  - Main files: `adjectives.txt`, `nouns.txt`, `verbs.txt`
  - Contents: 77 LLM-cliche words grouped by part of speech.
  - Possible use: direct LLM vocabulary review.

- `llm-slop-lists/detect-ai-text-easily`
  - Source: https://github.com/FareedKhan-dev/Detect-AI-text-Easily
  - Main file: `ai_words.txt`
  - Contents: 74 numbered AI-writing terms.
  - Possible use: direct lexicon after deduplication and fixture review.

- `llm-slop-lists/community-gists`
  - Sources:
    - https://gist.github.com/chrisgherbert/c734ec50ae464135be57cd03b84281f9
    - https://gist.github.com/pvgomes/fffac02b4f39a50828ed2624a0dc190a
    - https://gist.github.com/miglen/3194fd0924cac81e6d3d735852d5e00f
  - Contents: community lists of ChatGPT cliches, overused words, and anti-slop writing instructions.
  - Possible use: review material, fixture generation, and template ideas.
  - Caveat: weakest provenance in this source folder.

- `prose-linters/proselint`
  - Source: https://github.com/amperser/proselint
  - Main files: selected checks under `proselint/checks`.
  - Contents: cliches, hedges, industrial language, redundancy, needless variants, social-awareness checks, skunked terms, uncomparables, and weasel-word checks.
  - Possible use: direct lexicons, replacement pairs, and pattern sources.

- `prose-linters/npm-packages`
  - Sources:
    - https://www.npmjs.com/package/write-good
    - https://www.npmjs.com/package/no-cliches
    - https://www.npmjs.com/package/too-wordy
    - https://www.npmjs.com/package/weasel-words
    - https://www.npmjs.com/package/adverb-where
    - https://www.npmjs.com/package/cliches
  - Contents: npm tarball contents for prose linting packages.
  - Possible use: direct lexicons and pattern behavior references.
  - Local note: package/test/build scaffolding is omitted so repository validators do not treat these as nested Slopless packages.

- `style-guides/microsoft`
  - Source: https://github.com/vale-cli/Microsoft
  - Contents: Microsoft Vale rules.
  - Possible use: avoid terms, wordiness, preferred replacements, and technical-writing pattern ideas.

- `style-guides/google`
  - Source: https://github.com/vale-cli/Google
  - Contents: Google Vale rules.
  - Possible use: word-list replacements, slang, Latin forms, future-tense warnings, and punctuation templates.

- `style-guides/elastic`
  - Source: https://github.com/elastic/vale-rules
  - Contents: Elastic Vale rules.
  - Possible use: technical-writing word choice, wordiness, device/directional language, negations, and repetition.

- `style-guides/joblint`
  - Source: https://github.com/vale-cli/Joblint
  - Contents: hiring-posting language rules.
  - Possible use: domain-specific corporate or job-posting prose.

- `plain-english`
  - Sources:
    - https://www.gov.uk/guidance/content-design/writing-for-gov-uk
    - https://www.gov.uk/guidance/style-guide/a-to-z
    - https://www.gov.uk/guidance/style-guide/technical-content-a-to-z
    - https://www.gca.gov.uk/government-commercial-agency-style-guide/language
    - https://www.gca.gov.uk/government-commercial-agency-style-guide/language/words-to-watch
    - https://www.gca.gov.uk/government-commercial-agency-style-guide/language/words-not-to-use
    - https://mstrust.org.uk/sites/default/files/plain_english_campaign_alternative_words.pdf
    - https://peteroupc.github.io/usage.pdf
  - Contents: plain-English avoid words, wordiness, alternatives, and overused/discouraged words.
  - Possible use: direct lexicon and replacement-pair mining.
  - Cleaned extraction notes live in `plain-english/extracted`.

- `academic-slop/tortured-phrases`
  - Sources:
    - https://arxiv.org/abs/2107.06751
    - https://zenodo.org/records/5119079
    - https://dbrech.irit.fr/pls/apex/f?p=9999:24:::NO
    - https://zenodo.org/records/14753785
  - Contents: tortured-phrase paper page, Problematic Paper Screener page, Cabanac Zenodo supplement, and humanities/social-science tortured-phrase CSVs.
  - Local note: the Cabanac Zenodo supplement is stored as a ZIP only. It contains large controls and spreadsheets that should be extracted locally only when needed.
  - Possible use: academic-specific phrase-pair detection and paraphrase-template mining.
  - Caveat: should remain separate from default prose rules.
  - Cleaned extraction notes live in `academic-slop/tortured-phrases/extracted`.

## Extraction Rules

- Do not import an upstream list wholesale into rules.
- First convert the source into normalized not-implemented material with provenance.
- Split by likely target family: words, phrases, syntactic patterns, semantic-thinness templates, or domain-specific rules.
- Add fixtures before implementing source material.
- Treat generated-model word lists as scores or weak signals unless the phrase is specific enough to stand alone.
- Treat academic tortured phrases as a separate domain family.
- Once material is implemented, remove it from `derived/` and record it in `incorporation-record.md`.
