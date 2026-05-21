# Contributing to slopless

Thanks for your interest. The fastest way to get a change in is usually to open a detailed issue, not a PR.

## How to contribute

### 1. Open a detailed issue (preferred)

When you spot a bug, want a new rule, or want to change behavior, open an issue with as much detail as you can:

- The pattern (for rule requests, quote 2-5 example phrases that show the slop pattern)
- Why this is slop, or why the current behavior is wrong
- Examples that should NOT fire (acceptable variants, false-positive guards)
- Suggested rule ID and family (metrics, orthography, phrases, syntactic-patterns, semantic-thinness, narrative-slop, academic-slop, term-policy)
- Suggested file location and any sibling rules to follow as a template

Detailed issues are easy to one-shot with an agent. The clearer the spec, the faster the turnaround. Most issues get picked up and implemented without needing a PR from you.

The issue forms in `.github/ISSUE_TEMPLATE/` collect these fields by default.

### 2. Send a pull request (also fine)

If you want to implement the change yourself, go ahead. All contributed code must pass the pre-commit hooks before it can be merged.

## Pre-commit hooks

This repo uses **G3TS** (the TypeScript variant of [guardrail3](https://github.com/agent-quality-controls/guardrail3)) as a pre-commit gate. G3TS enforces deterministic code quality on every commit: formatting (prettier), linting (eslint), banned APIs, banned globals, architectural topology, dependency allowlists, full type coverage, and suppression visibility.

Hooks run automatically on `git commit`. A failing commit is rejected with a list of findings. Fix them and recommit, or open an issue if a hook fires on code that should be allowed.

If a PR cannot get past the hooks, CI will fail too. The pre-commit gate is non-negotiable for merging.

## Dev setup

Requires Node.js 20 or newer.

```bash
git clone https://github.com/seochecks-ai/slopless.git
cd slopless
npm install
npm run build
```

Run the full validation pipeline (the same checks the pre-commit gate runs):

```bash
npm run validate
```

## Rule design principles

- **Deterministic.** No LLMs, no probabilistic scoring. Same input, same output, every time.
- **Narrow.** Each rule targets one specific pattern. Don't bundle.
- **Owned by data.** Dictionary-driven rules keep their dictionaries in `data/` where they can be reviewed independently.
- **Honest about coverage.** Document known false positives in fixtures rather than papering over them.
