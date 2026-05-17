# Slop Source Material

Raw source archive for future Slopless lexicons, patterns, and templates.

This directory is not active rule data. Active shipped rule data still lives under `src/families/*/data`.

For the record of what has already moved into active rules, see `incorporation-record.md`.

## Inventory

- `llm-excess-vocab/berenslab`
  - Source: https://github.com/berenslab/llm-excess-vocab
  - Main file: `excess_words.csv`
  - Contents: 900 excess PubMed words with `word`, `type`, `part_of_speech`, and `comment`.
  - Best use: direct lexicon after filtering to style rows first.
  - Caveat: PubMed domain terms are unsafe for default prose rules.

- `llm-excess-vocab/detect-chatgpt`
  - Source: https://github.com/atsyplenkov/detect-chatgpt
  - Main file: `ges_selected_lemma.csv`
  - Contents: 983 scored lemmas plus package code that appends extra indicator words.
  - Best use: empirical word-score source.
  - Caveat: built from academic/ChatGPT excess-word analysis, so default use needs review.

- `llm-slop-lists/slop-forensics`
  - Source: https://github.com/sam-paech/slop-forensics
  - Main files: root `slop_list*.json`, essay-domain lists, varied-prompt lists.
  - Contents: word, bigram, trigram, frequency, and phrase-count lists.
  - Best use: direct ngram lexicons and pattern/template mining.
  - Caveat: creative-writing lists contain generated names and genre terms that should not become default words.

- `llm-slop-lists/llm-cliches`
  - Source: https://github.com/nanxstats/llm-cliches
  - Main files: `adjectives.txt`, `nouns.txt`, `verbs.txt`
  - Contents: 77 LLM-cliche words grouped by part of speech.
  - Best use: direct LLM vocabulary candidates.

- `llm-slop-lists/detect-ai-text-easily`
  - Source: https://github.com/FareedKhan-dev/Detect-AI-text-Easily
  - Main file: `ai_words.txt`
  - Contents: 74 numbered AI-writing terms.
  - Best use: candidate direct lexicon after deduplication.

- `llm-slop-lists/community-gists`
  - Sources:
    - https://gist.github.com/chrisgherbert/c734ec50ae464135be57cd03b84281f9
    - https://gist.github.com/pvgomes/fffac02b4f39a50828ed2624a0dc190a
    - https://gist.github.com/miglen/3194fd0924cac81e6d3d735852d5e00f
  - Contents: community lists of ChatGPT cliches, overused words, and anti-slop writing instructions.
  - Best use: review material, fixture generation, and template ideas.
  - Caveat: weakest provenance in this archive.

- `prose-linters/proselint`
  - Source: https://github.com/amperser/proselint
  - Main files: selected checks under `proselint/checks`.
  - Contents: cliches, hedges, industrial language, redundancy, needless variants, social-awareness checks, skunked terms, uncomparables, and weasel-word checks.
  - Best use: direct lexicons, replacement pairs, and pattern sources.

- `prose-linters/npm-packages`
  - Sources:
    - https://www.npmjs.com/package/write-good
    - https://www.npmjs.com/package/no-cliches
    - https://www.npmjs.com/package/too-wordy
    - https://www.npmjs.com/package/weasel-words
    - https://www.npmjs.com/package/adverb-where
    - https://www.npmjs.com/package/cliches
  - Contents: npm tarball contents for prose linting packages.
  - Best use: direct lexicons and pattern behavior references.
  - Local note: package/test/build scaffolding is omitted so repository validators do not treat these archives as nested Slopless packages.

- `style-guides/microsoft`
  - Source: https://github.com/vale-cli/Microsoft
  - Contents: Microsoft Vale rules.
  - Best use: avoid terms, wordiness, preferred replacements, and technical-writing pattern ideas.

- `style-guides/google`
  - Source: https://github.com/vale-cli/Google
  - Contents: Google Vale rules.
  - Best use: word-list replacements, slang, Latin forms, future-tense warnings, and punctuation templates.

- `style-guides/elastic`
  - Source: https://github.com/elastic/vale-rules
  - Contents: Elastic Vale rules.
  - Best use: technical-writing word choice, wordiness, device/directional language, negations, and repetition.

- `style-guides/joblint`
  - Source: https://github.com/vale-cli/Joblint
  - Contents: hiring-posting language rules.
  - Best use: domain-specific corporate/job-posting slop, not default prose.

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
  - Best use: direct lexicon and replacement-pair mining.
  - Cleaned extraction notes live in `plain-english/extracted`.

- `academic-slop/tortured-phrases`
  - Sources:
    - https://arxiv.org/abs/2107.06751
    - https://zenodo.org/records/5119079
    - https://dbrech.irit.fr/pls/apex/f?p=9999:24:::NO
    - https://zenodo.org/records/14753785
  - Contents: tortured-phrase paper page, Problematic Paper Screener page, Cabanac Zenodo supplement, and humanities/social-science tortured-phrase CSVs.
  - Local note: the Cabanac Zenodo supplement is stored as a ZIP only. It contains large controls and spreadsheets that should be extracted locally only when needed.
  - Best use: academic-specific phrase-pair detection and paraphrase-template mining.
  - Caveat: should remain separate from default prose rules.
  - Cleaned extraction notes live in `academic-slop/tortured-phrases/extracted`.

## Extraction Rules For Future Work

- Do not import an upstream list wholesale into active rules.
- First convert the source into a normalized candidate file with provenance.
- Split candidates by likely target family: words, phrases, syntactic patterns, semantic-thinness templates, or domain-specific rules.
- Add fixtures before enabling a source in active Slopless rules.
- Treat generated-model word lists as scoring or weak signals unless the phrase is specific enough to stand alone.
- Treat academic tortured phrases as a separate domain family.
