# Source Ledger And Corpus Coverage

## Goal

Clean up source-material bookkeeping and make fixture coverage mechanically checkable.

Desired state:

- source candidates that we chose not to implement are recorded as skipped, with reasons
- active derived candidate files no longer imply skipped material is still waiting to be implemented
- every nonblank case line is present in corpus text
- every corpus preserve entry points to a current case source, line number, bucket, family, and exact text
- corpus fixture output contains the same non-document-rule findings as case fixture output, with corpus allowed to contain additional findings

## Approach

1. Add a manifest for this fixture/source cleanup.
2. Add a verifier that checks:
   - skipped source ledger sections exist
   - no active candidate file keeps `Not Implemented` entries for skipped material
   - every case line is present in at least one corpus markdown file
   - every preserve item matches a current case line exactly
   - every preserve item text appears in its owning corpus markdown file
   - approved fixture output covers case findings in corpus for rules whose messages are local to the matched text
3. Update source-material bookkeeping:
   - move skipped candidates into `data/source-material/incorporation-record.md`
   - clear active candidate files to say no active candidate remains where applicable
   - fix `sunstone-slop-cases.md` so it no longer says the whole file is not implemented
4. Regenerate preserve JSON metadata from current case files and current corpus file contents.
5. Review corpus prose files and keep the exact case lines while improving topic grouping where safe.
6. Run Fixture3, the new verifier, `scripts/verify-all.sh`, and `npm run validate`.

## Key decisions

- Do not delete source candidate files that the existing source-pattern manifest references. Keep the paths stable and make their current state explicit.
- Do not implement the remaining academic, cliche, corporate abstraction, or incomplete LLM phrase candidates in this change. They were already classified as false-positive-prone or incomplete.
- Do not force exact metric scores to match between case documents and corpus documents. Metrics are document-level, so corpus coverage for metrics is verified by fixture text presence and rule presence, not identical numeric messages.
- Treat preserve JSON as generated metadata over cases and corpus, not as a second source of truth.

## Files to modify

- `.plans/2026-05-18-095432-source-ledger-and-corpus-coverage.md`
- `.plans/2026-05-18-095432-source-ledger-and-corpus-coverage.md.manifest.toml`
- `scripts/verify-fixture-corpus-coverage.py`
- `scripts/verify-all.sh`
- `data/source-material/incorporation-record.md`
- `data/source-material/derived/academic-slop-candidates.md`
- `data/source-material/derived/cliche-template-candidates.md`
- `data/source-material/derived/corporate-abstraction-candidates.md`
- `data/source-material/derived/llm-artifact-candidates.md`
- `data/source-material/derived/sunstone-slop-cases.md`
- `behavior/fixtures/textlint-rules/corpus/*.md`
- `behavior/fixtures/textlint-rules/corpus/*.preserve.json`
- `behavior/golden/textlint-rules/approved.normalized.json`
- `behavior/golden/textlint-rules/approved.meta.json`
