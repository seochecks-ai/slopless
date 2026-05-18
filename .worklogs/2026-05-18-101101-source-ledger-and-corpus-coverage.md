Summary

Cleaned source-material bookkeeping and made corpus coverage mechanically verifiable. The corpus now preserves every current case line, preserve metadata was regenerated from the case files, and Fixture3 approved output now reflects the rewritten corpus.

Decisions made

- Kept derived source files as stable referenced paths, but changed active candidate files so skipped material is archived in the incorporation record instead of appearing queued for implementation.
- Classified every `data/source-material/derived/*.md` file in the manifest as skipped, drained, or source-only.
- Added `scripts/verify-fixture-corpus-coverage.py` to verify source classification, case-to-corpus text coverage, preserve metadata, and approved output coverage.
- Excluded document-level rules from case-vs-corpus output parity because metrics and term-policy counts legitimately change when isolated case files are embedded in full corpus documents.
- Regenerated preserve JSON from current case files instead of preserving stale line metadata.

Key files for context

- `.plans/2026-05-18-095432-source-ledger-and-corpus-coverage.md`
- `.plans/2026-05-18-095432-source-ledger-and-corpus-coverage.md.manifest.toml`
- `scripts/verify-fixture-corpus-coverage.py`
- `scripts/verify-corpus-preserve.py`
- `data/source-material/incorporation-record.md`
- `data/source-material/derived/*.md`
- `behavior/fixtures/textlint-rules/corpus/*.md`
- `behavior/fixtures/textlint-rules/corpus/*.preserve.json`
- `behavior/golden/textlint-rules/approved.normalized.json`

Verification

- `scripts/verify-fixture-corpus-coverage.py`
- `scripts/verify-all.sh`
- `scripts/fixture3.sh check --suite textlint-rules`
- `npm run validate`
- Adversarial review found derived source classification gaps; those were fixed and the verifier now rejects unclassified derived source files.

Next steps

- Commit this work on top of the remote `development` history so the branch does not retain duplicate patch-equivalent commits.
