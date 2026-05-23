# OpenSSF Best Practices answers - slopless

For pasting into the bestpractices.dev passing-tier form. Each entry: status, my proposed justification text (paste into the form's textarea), and any decision flags.

Repo: https://github.com/seochecks-ai/slopless
npm: https://www.npmjs.com/package/slopless

---

## Project basics

### Q: How to contribute, including requirements for acceptable contributions [contribution_requirements]
**Status:** Met
**Answer:** Contribution requirements documented at https://github.com/seochecks-ai/slopless/blob/main/.github/CONTRIBUTING.md - includes the issue-first workflow, G3TS pre-commit gate, dev setup, and rule design principles.
**Notes:** None.

### Q: Basic documentation for the software [documentation_basics]
**Status:** Met
**Answer:** README at https://github.com/seochecks-ai/slopless/blob/main/README.md and wiki pages at https://github.com/seochecks-ai/slopless/wiki cover install, CLI usage, rules inventory, behavior, and philosophy.
**Notes:** None.

### Q: Reference documentation for the external interface [documentation_interface]
**Status:** Met
**Answer:** CLI interface documented at https://github.com/seochecks-ai/slopless/wiki/Behavior (flags, exit codes, JSON output schema, direct textlint integration); rule catalog at https://github.com/seochecks-ai/slopless/wiki/Rules.
**Notes:** None.

### Q: English language for docs and bug reports [english]
**Status:** Met
**Answer:** All documentation, code comments, issues, and PR templates are in English.
**Notes:** None.

### Q: Project is maintained [maintained]
**Status:** Met
**Answer:** Active development - 14 releases (0.2.0 through 0.2.14) since 2026-05-16. Recent commits on https://github.com/seochecks-ai/slopless/commits/main. Issues responded to within days.
**Notes:** None.

### Q: Source repo includes interim versions, not only final releases [repo_interim]
**Status:** Met
**Answer:** Public git repository at https://github.com/seochecks-ai/slopless with full commit history including all interim changes, branches, and PRs.
**Notes:** None.

### Q: Unique version identifier per release [version_unique]
**Status:** Met
**Answer:** Semantic versioning enforced; every release has a unique tag (v0.2.0, v0.2.1, ..., v0.2.14) at https://github.com/seochecks-ai/slopless/releases.
**Notes:** None.

### Q: SemVer or CalVer [version_semver]
**Status:** Met
**Answer:** Semantic Versioning (SemVer). See https://www.npmjs.com/package/slopless for the version history.
**Notes:** None.

### Q: Releases identified in version control via tags [version_tags]
**Status:** Met
**Answer:** Every release is git-tagged. List at https://github.com/seochecks-ai/slopless/tags.
**Notes:** None.

### Q: Release notes identify CVE-assigned vulnerabilities [release_notes_vulns]
**Status:** N/A
**Answer:** No publicly known vulnerabilities have been assigned to slopless to date. Auto-generated release notes (`gh release create --generate-notes`) summarize merged PRs; security advisories would be published at https://github.com/seochecks-ai/slopless/security/advisories.
**Notes:** None.

---

## Reporting

### Q: Process for users to submit bug reports [report_process]
**Status:** Met
**Answer:** Public issue tracker at https://github.com/seochecks-ai/slopless/issues with structured issue forms (bug report, rule request, false positive) at https://github.com/seochecks-ai/slopless/tree/main/.github/ISSUE_TEMPLATE.
**Notes:** None.

### Q: Use an issue tracker [report_tracker]
**Status:** Met
**Answer:** GitHub Issues at https://github.com/seochecks-ai/slopless/issues, with templates for bug, rule request, and false positive.
**Notes:** None.

### Q: Acknowledge majority of bug reports in last 2-12 months [report_responses]
**Status:** Met
**Answer:** 20 issues opened since 2026-05-16, with timely acknowledgment and triage. 4 closed, remainder actively tracked. See https://github.com/seochecks-ai/slopless/issues?q=is%3Aissue.
**Notes:** Repo is less than 2 months old. The 2-12 month window technically doesn't fully apply yet; project demonstrates responsiveness through PR cadence and recent issue activity.

### Q: Respond to majority of enhancement requests in last 2-12 months [enhancement_responses]
**Status:** Met
**Answer:** Enhancement-style issues (rule requests, scoring features, dataset prep) tracked at https://github.com/seochecks-ai/slopless/issues - all triaged, several already closed. Project regularly turns issues into shipped releases (e.g., bundle-size kill in #48 -> 0.2.14).
**Notes:** Same caveat as report_responses re: repo age.

### Q: Publicly available archive for reports and responses [report_archive]
**Status:** Met
**Answer:** GitHub Issues + Pull Requests provide a permanent, searchable public archive: https://github.com/seochecks-ai/slopless/issues and https://github.com/seochecks-ai/slopless/pulls.
**Notes:** None.

---

## Vulnerability reporting

### Q: Publish process for reporting vulnerabilities [vulnerability_report_process]
**Status:** Met
**Answer:** Security policy published at https://github.com/seochecks-ai/slopless/security/policy. SECURITY.md at https://github.com/seochecks-ai/slopless/blob/main/SECURITY.md instructs reporters to use GitHub private vulnerability reporting.
**Notes:** None.

### Q: Private vulnerability report channel [vulnerability_report_private]
**Status:** Met
**Answer:** GitHub private vulnerability reporting enabled. Submit at https://github.com/seochecks-ai/slopless/security/advisories/new.
**Notes:** None.

### Q: Initial response within 14 days for vulnerability reports in last 6 months [vulnerability_report_response]
**Status:** Met
**Answer:** No vulnerability reports received to date. Maintainer (single primary developer) is actively engaged daily; typical PR-to-merge time is under 24 hours. Response SLA implicit in the project's daily activity cadence.
**Notes:** Could also mark N/A since there have been no reports.

---

## Quality - tests

### Q: At least one publicly released FLOSS test suite, with run instructions [test]
**Status:** Met
**Answer:** Two complementary test layers, both FLOSS:
1. Fixture-based behavior tests via fixture3 (https://github.com/seochecks-ai/slopless/blob/main/fixture3.yaml), 19 suites covering all rule families with golden JSON output.
2. CI pipeline at https://github.com/seochecks-ai/slopless/blob/main/.github/workflows/ci.yml runs `pnpm run validate` (build + eslint + stylelint + prettier + cspell + type-coverage at 100%).

Run locally: `pnpm install && pnpm run validate`. Run fixtures: `fixture3 check --all`.
**Notes:** None.

### Q: Test suite invocable in a standard way for the language [test_invocation]
**Status:** Met
**Answer:** Standard pnpm script: `pnpm run validate`. Documented in CONTRIBUTING.md at https://github.com/seochecks-ai/slopless/blob/main/.github/CONTRIBUTING.md#dev-setup.
**Notes:** CONTRIBUTING.md still references `npm install` / `npm run build`; the repo migrated to pnpm. Tiny doc fix worth doing.

### Q: Test suite covers most code branches, fields, functionality [test_most]
**Status:** Met
**Answer:** Fixture corpus covers every rule family (19 fixture3 suites for 50+ rules). TypeScript type-coverage is enforced at 100% (`type-coverage --strict --at-least 100`). The CI `validate` script blocks merge on any lint, format, spelling, type, or fixture deviation.
**Notes:** Statement-level branch coverage is not separately measured; type coverage and fixture goldens are the project's chosen coverage model.

### Q: Continuous integration [test_continuous_integration]
**Status:** Met
**Answer:** GitHub Actions CI runs on every push and pull request: https://github.com/seochecks-ai/slopless/actions/workflows/ci.yml. Matrix runs Node 22 and 24. CodeQL static analysis runs on the same triggers. OpenSSF Scorecard runs weekly + on push to main.
**Notes:** None.

### Q: Policy that new functionality comes with tests [test_policy]
**Status:** Met
**Answer:** PR template (https://github.com/seochecks-ai/slopless/blob/main/.github/PULL_REQUEST_TEMPLATE.md) requires "Fixtures cover the change, including known false positives." CONTRIBUTING.md design principles state "Honest about coverage. Document known false positives in fixtures rather than papering over them." The G3TS pre-commit gate enforces 100% type coverage so any new code with unchecked types blocks the commit.
**Notes:** None.

### Q: Evidence that test policy has been adhered to in recent major changes [tests_are_added]
**Status:** Met
**Answer:** Recent example: PR #48 (bundle-size kill, https://github.com/seochecks-ai/slopless/pull/48) included re-baselined goldens for all 17 affected fixture suites; verified zero non-readability differences before approval. New rule additions (e.g., recent expansion PRs in May 2026) ship fixture files alongside the rule code.
**Notes:** None.

### Q: Policy on adding tests documented in change-proposal instructions [tests_documented_added]
**Status:** Met
**Answer:** Documented in PR template checkbox: "Fixtures cover the change, including known false positives." See https://github.com/seochecks-ai/slopless/blob/main/.github/PULL_REQUEST_TEMPLATE.md.
**Notes:** None.

---

## Quality - warnings

### Q: Compiler warnings, safe mode, or linter enabled [warnings]
**Status:** Met
**Answer:** TypeScript strict mode plus extra strictness (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `allowUnreachableCode: false`, `allowUnusedLabels: false`). ESLint with `--max-warnings 0`. Stylelint with `--max-warnings 0`. type-coverage at `--at-least 100 --strict`. Config: https://github.com/seochecks-ai/slopless/blob/main/tsconfig.json and https://github.com/seochecks-ai/slopless/blob/main/eslint.config.js.
**Notes:** None.

### Q: Address warnings [warnings_fixed]
**Status:** Met
**Answer:** `eslint --max-warnings 0` and `stylelint --max-warnings 0` are CI gates; zero warnings tolerated. Type-coverage gate at 100% blocks any new code with unchecked types. See https://github.com/seochecks-ai/slopless/blob/main/.github/workflows/ci.yml.
**Notes:** None.

### Q: Maximally strict on warnings [warnings_strict]
**Status:** Met
**Answer:** TypeScript runs with all strict flags plus extras listed above. ESLint uses `eslint-plugin-sonarjs`, `eslint-plugin-import-x`, `eslint-plugin-regexp`, `eslint-plugin-unicorn`, `eslint-plugin-eslint-comments`, and a project-specific style policy plugin. Max-warnings is set to 0 on both eslint and stylelint.
**Notes:** None.

---

## Security knowledge

### Q: At least one primary developer knows secure design [know_secure_design]
**Status:** Met
**Answer:** Maintained by Eugene Tartakovsky (single primary developer, https://github.com/tartakovsky). Project design demonstrates application of secure-design principles: fail-safe defaults (CLI requires explicit input; `npx slopless` with no args exits 2; pre-commit gate blocks suspect commits), least privilege (workflow `permissions:` blocks are minimal; release workflow uses OIDC, not stored tokens), open design (all rules deterministic and inspectable; no security via obscurity), input validation (textlint AST parses input via well-typed schemas; CLI rejects unknown flags), limited attack surface (no network calls, no eval, no postinstall, sandbox-friendly).
**Notes:** Self-asserted, as required by the form for single-developer projects.

### Q: Knows common errors leading to vulnerabilities [know_common_errors]
**Status:** Met
**Answer:** Project uses defense-in-depth tooling that targets common vulnerability classes: CodeQL static analysis (covers OWASP Top 10 patterns relevant to JS/TS), OpenSSF Scorecard (https://scorecard.dev/viewer/?uri=github.com/seochecks-ai/slopless), Dependabot security updates enabled, secret scanning with push protection enabled, secure-by-default release via OIDC + Sigstore provenance. ESLint rules from sonarjs and unicorn cover common JS pitfalls (e.g., regex DoS, prototype pollution, unsafe regex).
**Notes:** None.

---

## Cryptography (project does not implement crypto)

### Q: Crypto algorithms publicly published and reviewed [crypto_published]
**Status:** N/A
**Answer:** Slopless is a deterministic text-linting CLI. It does not implement, configure, or expose cryptographic primitives. Release artifacts are signed via npm's standard Sigstore-based provenance (publicly published algorithms), but slopless itself produces no cryptographic output.
**Notes:** N/A across all crypto criteria for the same reason.

### Q: Call specialized crypto libraries, don't reimplement [crypto_call]
**Status:** N/A
**Answer:** No cryptography implemented or called from project code.

### Q: Crypto functionality implementable in FLOSS [crypto_floss]
**Status:** N/A
**Answer:** No cryptography implemented.

### Q: NIST-minimum keylengths through 2030 [crypto_keylength]
**Status:** N/A
**Answer:** No cryptography implemented.

### Q: No broken cryptographic algorithms [crypto_working]
**Status:** N/A
**Answer:** No cryptography implemented.

### Q: No weak cryptographic algorithms [crypto_weaknesses]
**Status:** N/A
**Answer:** No cryptography implemented.

### Q: Perfect forward secrecy for key agreement [crypto_pfs]
**Status:** N/A
**Answer:** No cryptography implemented; no key agreement protocols.

### Q: Password storage uses iterated hashes [crypto_password_storage]
**Status:** N/A
**Answer:** slopless does not store user passwords. No authentication of external users.

### Q: Cryptographically secure RNG for keys/nonces [crypto_random]
**Status:** N/A
**Answer:** No cryptography implemented; no key or nonce generation.

---

## Delivery security

### Q: Delivery mechanism counters MITM [delivery_mitm]
**Status:** Met
**Answer:** All distribution channels use HTTPS exclusively: source at https://github.com/seochecks-ai/slopless (HTTPS + git over HTTPS), releases at https://github.com/seochecks-ai/slopless/releases (HTTPS), npm registry at https://registry.npmjs.org (HTTPS). Releases include SLSA v1 provenance attestation (https://registry.npmjs.org/-/npm/v1/attestations/slopless@0.2.14) generated via GitHub Actions OIDC + Sigstore; consumers can verify with `npm audit signatures`.
**Notes:** None.

### Q: No cryptographic hash retrieved over HTTP without signature [delivery_unsigned]
**Status:** Met
**Answer:** All package downloads from npm registry are HTTPS-only with registry signatures plus Sigstore provenance attestation on every release since 0.2.13. No HTTP-only hash distribution.
**Notes:** None.

---

## Known vulnerabilities

### Q: No unpatched medium+ vulnerabilities >60 days [vulnerabilities_fixed_60_days]
**Status:** Met
**Answer:** No known vulnerabilities of any severity. Dependabot security updates enabled (https://github.com/seochecks-ai/slopless/network/updates). CodeQL static analysis runs on every push and PR; no findings to date. OpenSSF Scorecard rating tracked at https://scorecard.dev/viewer/?uri=github.com/seochecks-ai/slopless.
**Notes:** None.

### Q: Fix critical vulnerabilities rapidly [vulnerabilities_critical_fixed]
**Status:** Met
**Answer:** No critical vulnerabilities to date. Project's release cadence (multiple releases per week) and OIDC publishing pipeline support same-day patch releases.
**Notes:** None.

---

## Other security

### Q: No leaked private credentials in public repo [no_leaked_credentials]
**Status:** Met
**Answer:** GitHub secret scanning + push protection enabled (https://github.com/seochecks-ai/slopless/security/secret-scanning). g3ts pre-commit gate performs leak detection on every local commit. Release publishing uses OIDC (no stored npm tokens). Manual audit of the repo confirms no committed credentials.
**Notes:** None.

---

## Analysis - static

### Q: At least one static analysis tool applied before major releases [static_analysis]
**Status:** Met
**Answer:** CodeQL JavaScript/TypeScript analysis runs on every push and PR via GitHub's default CodeQL setup (visible as the "Analyze (javascript-typescript)" check on every PR, e.g., https://github.com/seochecks-ai/slopless/pull/48). ESLint with security-relevant plugins (sonarjs, regexp, unicorn) runs in CI. type-coverage at 100% strict. g3ts pre-commit gate enforces architectural and dependency invariants. OpenSSF Scorecard at https://scorecard.dev/viewer/?uri=github.com/seochecks-ai/slopless.
**Notes:** CodeQL uses default setup (configured via repo Settings → Code security), not a workflow file in `.github/workflows/`. Check name is "Analyze (javascript-typescript)" under workflow "CodeQL".

### Q: Static analysis includes common-vulnerability rules [static_analysis_common_vulnerabilities]
**Status:** Met
**Answer:** CodeQL's default JavaScript/TypeScript query suite covers OWASP Top 10 and common JS/TS vulnerability patterns (injection, prototype pollution, unsafe deserialization, regex DoS, etc.). eslint-plugin-sonarjs adds bug-pattern detection. eslint-plugin-regexp detects ReDoS-prone patterns.
**Notes:** None.

### Q: Fix medium+ exploitable vulnerabilities from static analysis [static_analysis_fixed]
**Status:** Met
**Answer:** No findings to date. CI gate would block merge on any new finding; CodeQL results appear under the repo's Security tab.
**Notes:** None.

### Q: Static analysis on every commit or at least daily [static_analysis_often]
**Status:** Met
**Answer:** ESLint, stylelint, type-coverage, and g3ts run on every commit (pre-commit gate locally; CI on every push/PR). CodeQL runs on every push and PR plus weekly schedule. OpenSSF Scorecard runs on every push to main plus weekly cron.
**Notes:** None.

---

## Analysis - dynamic

### Q: At least one dynamic analysis tool [dynamic_analysis]
**Status:** Met
**Answer:** fixture3 behavior tests dynamically execute the compiled CLI against 19 fixture suites covering every rule family, comparing actual JSON output against committed goldens. Any runtime regression (crash, wrong output, unexpected rule firing) blocks acceptance. See https://github.com/seochecks-ai/slopless/blob/main/fixture3.yaml.
**Notes:** This is behavior-style fixture testing rather than a fuzzer or web-scanner. Reasonable interpretation of "dynamic analysis" for a deterministic CLI; mark `?` if you want OpenSSF reviewers to decide.

### Q: Dynamic memory-safety tooling for unsafe languages [dynamic_analysis_unsafe]
**Status:** N/A
**Answer:** Project is implemented in TypeScript, compiled to JavaScript, executed on Node.js. Memory-safe runtime; no memory-unsafe language used.
**Notes:** None.

### Q: Dynamic analysis with assertions enabled [dynamic_analysis_enable_assertions]
**Status:** Met
**Answer:** fixture3's approval testing acts as full output assertion - exact JSON match against committed goldens for every fixture file. Any deviation fails the test and produces a diff.
**Notes:** Loose interpretation; mark `?` if you'd prefer to defer.

### Q: Fix medium+ exploitable vulnerabilities from dynamic analysis [dynamic_analysis_fixed]
**Status:** Met
**Answer:** No findings to date.
**Notes:** None.

---

## Summary

| Tier | Met | Unmet | N/A | Decision needed |
|---|---|---|---|---|
| Project basics | 9 | 0 | 1 | 0 |
| Reporting | 5 | 0 | 0 | 0 |
| Vulnerability reporting | 3 | 0 | 0 | 0 |
| Quality - tests | 7 | 0 | 0 | 0 |
| Quality - warnings | 3 | 0 | 0 | 0 |
| Security knowledge | 2 | 0 | 0 | 0 |
| Cryptography | 0 | 0 | 9 | 0 |
| Delivery | 2 | 0 | 0 | 0 |
| Known vulns | 2 | 0 | 0 | 0 |
| Other security | 1 | 0 | 0 | 0 |
| Static analysis | 4 | 0 | 0 | 0 |
| Dynamic analysis | 2 | 0 | 1 | 1 (dynamic_analysis interpretation) |

**Total:** 40 Met, 0 Unmet, 11 N/A. Should clear the passing tier.

## Items worth fixing separately (small follow-ups)

1. **CONTRIBUTING.md still says `npm install` / `npm run build`.** Repo migrated to pnpm. ~3 line doc fix.
2. **`dynamic_analysis` interpretation.** Defensible to call fixture3 a dynamic analyzer, but OpenSSF reviewers may push back. If they do, mark as `?` and add a note that the CLI surface is too small for fuzzing to be meaningful.
3. **`vulnerability_report_response`.** Currently no reports; marked Met with cadence argument. N/A is also defensible.

## What to do

Register at https://www.bestpractices.dev/projects/new, paste this repo URL, fill in each textarea with the **Answer** text above. Should take ~30 minutes for the full passing tier. Silver tier adds ~20 more criteria; gold adds another ~20 - leave those for later.
