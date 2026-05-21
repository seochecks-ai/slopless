# slopless

[![npm](https://img.shields.io/npm/v/slopless?label=npm)](https://www.npmjs.com/package/slopless)
[![downloads](https://img.shields.io/npm/dm/slopless)](https://www.npmjs.com/package/slopless)
[![license](https://img.shields.io/npm/l/slopless)](LICENSE)
[![ci](https://img.shields.io/github/actions/workflow/status/seochecks-ai%2Fslopless/ci.yml?branch=main&label=ci)](/actions/workflows/ci.yml)
[![node](https://img.shields.io/node/v/slopless)](package.json)

Catch AI and human slop in English Markdown without calling an LLM. Slopless ships 50+ deterministic textlint rules and a CLI that emits structured JSON findings.

## Intended Usage Loop

```bash
npm install -D slopless
npx slopless install-skill codex
npx slopless install-skill claude
```

Then start a fresh writing-agent session and tell it to use the Slopless skill:

```text
Use the Slopless skill. Check this Markdown, rewrite the prose, and keep iterating until Slopless passes.
```

Loop:

1. Install Slopless.
2. Install the agent skill for Codex or Claude Code.
3. Tell the writing agent to use the skill.
4. Let the agent run Slopless, rewrite, and rerun until the JSON output has no findings.
5. Profit.

## Direct CLI Use

```bash
npx slopless "docs/**/*.md"
```

Slopless is English-only. It requires a file path, glob, or stdin input. A bare `npx slopless` exits with code `2`.

Exit `0` means clean. Exit `1` means findings. Exit `2` means failure.

Output is always JSON:

```bash
mkdir -p .slopless/findings
npx slopless "docs/**/*.md" > ".slopless/findings/$(date +%Y-%m-%d-%H%M%S)--review.json"
```

## Agent Use

Agents should run help first:

```bash
npx slopless --help
```

Agents should save raw JSON findings under `.slopless/findings/` in the current working directory. Slopless does not choose redirected output filenames, slugs, or timestamps.

Install the Codex skill into the current repo:

```bash
npx slopless install-skill codex
```

Install the Claude Code skill into the current repo:

```bash
npx slopless install-skill claude
```

Both commands install the same `slopless` skill body. Start a new agent session after installing if the skill is not visible.

## Ignore rules

Use textlint comments around intentional exceptions:

```markdown
<!-- textlint-disable slopless/semantic-thinness -->

Something shifted in the room.

<!-- textlint-enable slopless/semantic-thinness -->
```

## More

- [Philosophy](https://github.com/seochecks-ai/slopless/wiki/Philosophy) - what slopless is for, design principles, why deterministic.
- [Comparison](https://github.com/seochecks-ai/slopless/wiki/Comparison) - slopless vs proselint, write-good, alex, vale, default textlint presets.
- [Rules](https://github.com/seochecks-ai/slopless/wiki/Rules) - full 50+ rule inventory across seven families.
- [Behavior](https://github.com/seochecks-ai/slopless/wiki/Behavior) - CLI flags, exit codes, JSON output shape, direct textlint integration.
- [Ignore rules](https://github.com/seochecks-ai/slopless/wiki/Ignore-Rules) - inline `textlint-disable` block syntax.
- [Thanks](https://github.com/seochecks-ai/slopless/wiki/Thanks) - direct rule sources, dependencies, and acknowledgments.
- [Contributing](.github/CONTRIBUTING.md) - open a detailed issue first; PRs must pass the G3TS pre-commit gate.

---

Developed by [seochecks.ai](https://seochecks.ai) to keep content specific, useful, and recognizably human.
