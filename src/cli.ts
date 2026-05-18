#!/usr/bin/env node

import { cp, rm, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cli } from "textlint/lib/src/cli.js";

type SkillTarget = "claude" | "codex";

const FORMAT_FLAGS = new Set(["--format", "-f"]);
const HELP_FLAGS = new Set(["--help", "-h"]);
const STDIN_FLAGS = new Set(["--stdin"]);
const VERSION_FLAGS = new Set(["--version", "-v"]);
const CONFIG_FLAGS = new Set(["--config", "-c"]);
const FORCE_FLAGS = new Set(["--force"]);
const INSTALL_SKILL_COMMAND = "install-skill";
const VALUE_OPTIONS = new Set([
  "--cache-location",
  "--config",
  "--ignore-path",
  "--output-file",
  "--plugin",
  "--preset",
  "--rule",
  "--rules-base-directory",
  "--rulesdir",
  "--stdin-filename",
  "-c",
  "-o"
]);
const VERSION = "0.2.8";
const HELP_TEXT = `Slopless checks English Markdown prose for deterministic AI and human slop signals.

It reports concrete patterns that make writing padded, vague, generic,
formulaic, or mechanically careless. It is English-only. Output is always
textlint JSON.

Install:
  npm install -D slopless

Run:
  npx slopless "docs/**/*.md"
  npx slopless draft.md > .slopless/findings/2026-05-18-150000--draft.json

Agent run:
  npx slopless --help
  mkdir -p .slopless/findings
  npx slopless "docs/**/*.md" > ".slopless/findings/$(date +%Y-%m-%d-%H%M%S)--review.json"

Agent skill install:
  npx slopless install-skill codex
  npx slopless install-skill claude

Package script:
  {
    "scripts": {
      "lint:prose": "slopless \\"docs/**/*.md\\""
    }
  }

Default behavior:
  - A file path, glob, or stdin input is required.
  - Slopless is English-only.
  - Output is always JSON.
  - Exit 0 means no findings.
  - Exit 1 means Slopless found prose issues.
  - Exit 2 means the command failed before linting.
  - No .textlintrc.json is required.
  - No separate textlint install is required.

What it is for:
  Slopless is for deterministic prose checks in CI, local scripts, and review
  pipelines. It catches AI-style phrasing, empty claims, rhetorical filler,
  weak lead-ins and closers, hedge stacking, readability problems, and Markdown
  style signals.

What it is not for:
  Slopless does not rewrite text, check facts, judge taste, or replace human
  editing. It reports concrete rule findings that another tool or person can
  review.

Useful forms:
  npx slopless --stdin --stdin-filename draft.md
  npx slopless "docs/**/*.md" > .slopless/findings/review.json
  npx slopless "docs/**/*.md" --quiet

Agent storage convention:
  Agents should save raw JSON findings inside .slopless/findings/ in the
  current working directory. Slopless does not choose filenames, slugs, or
  timestamps for redirected output.

Ignore one rule:
  <!-- textlint-disable slopless/semantic-thinness -->

  Something shifted in the room.

  <!-- textlint-enable slopless/semantic-thinness -->

Unsupported:
  --format and -f are rejected. JSON is the only output format.
`;

function skillDestination(target: SkillTarget): string {
  switch (target) {
    case "claude":
      return ".claude/skills/slopless";
    case "codex":
      return ".agents/skills/slopless";
  }
}

function isSkillTarget(value: string | undefined): value is SkillTarget {
  return value === "claude" || value === "codex";
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function hasFormatOverride(args: readonly string[]): boolean {
  return args.some(
    (arg, index) =>
      FORMAT_FLAGS.has(arg) ||
      arg.startsWith("--format=") ||
      (index > 0 && FORMAT_FLAGS.has(args[index - 1] ?? ""))
  );
}

function hasFlag(args: readonly string[], flags: ReadonlySet<string>): boolean {
  return args.some((arg) => flags.has(arg));
}

function hasFileTarget(args: readonly string[]): boolean {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === undefined) {
      continue;
    }

    if (arg.trim() === "") {
      continue;
    }

    if (VALUE_OPTIONS.has(arg)) {
      index += 1;
      continue;
    }

    if (arg.startsWith("--") && arg.includes("=")) {
      continue;
    }

    if (arg.startsWith("-")) {
      continue;
    }

    return true;
  }

  return false;
}

function packageRoot(): string {
  return dirname(dirname(fileURLToPath(import.meta.url)));
}

function packageNodeModules(): string {
  return resolve(packageRoot(), "..");
}

async function installSkill(
  target: SkillTarget,
  force: boolean
): Promise<number> {
  const source = resolve(packageRoot(), "skills", "slopless");
  const destination = resolve(process.cwd(), skillDestination(target));

  if ((await pathExists(destination)) && !force) {
    process.stderr.write(
      `Slopless skill already exists at ${skillDestination(target)}. Re-run with --force to replace it.\n`
    );
    return 2;
  }

  if (force) {
    await rm(destination, { force: true, recursive: true });
  }

  await cp(source, destination, { recursive: true });
  process.stdout.write(
    [
      `Installed Slopless skill for ${target}:`,
      `${skillDestination(target)}/SKILL.md`,
      "",
      `Start a new ${target === "codex" ? "Codex" : "Claude Code"} session before relying on automatic skill discovery.`,
      `If the skill is not visible, load ${skillDestination(target)}/SKILL.md as context.`
    ].join("\n") + "\n"
  );
  return 0;
}

async function readStdin(): Promise<string> {
  let text = "";
  const stream = process.stdin.setEncoding("utf8") as AsyncIterable<string>;

  for await (const chunk of stream) {
    text += chunk;
  }

  return text;
}

async function main(): Promise<number> {
  const userArgs = process.argv.slice(2);

  if (hasFlag(userArgs, HELP_FLAGS)) {
    process.stdout.write(HELP_TEXT);
    return 0;
  }

  if (hasFlag(userArgs, VERSION_FLAGS)) {
    process.stdout.write(`${VERSION}\n`);
    return 0;
  }

  if (userArgs[0] === INSTALL_SKILL_COMMAND) {
    const target = userArgs[1];

    if (!isSkillTarget(target)) {
      process.stderr.write(
        "Usage: slopless install-skill codex|claude [--force]\n"
      );
      return 2;
    }

    const extraArgs = userArgs.slice(2);

    if (extraArgs.some((arg) => !FORCE_FLAGS.has(arg))) {
      process.stderr.write(
        "Usage: slopless install-skill codex|claude [--force]\n"
      );
      return 2;
    }

    return installSkill(target, hasFlag(extraArgs, FORCE_FLAGS));
  }

  if (hasFormatOverride(userArgs)) {
    process.stderr.write(
      "slopless always writes JSON output. Remove --format / -f.\n"
    );
    return 2;
  }

  if (!hasFileTarget(userArgs) && !hasFlag(userArgs, STDIN_FLAGS)) {
    process.stderr.write(
      "slopless requires a file path, glob, or --stdin input. Run slopless --help.\n"
    );
    return 2;
  }

  const args = [
    "node",
    "slopless",
    ...(hasFlag(userArgs, CONFIG_FLAGS)
      ? []
      : ["--config", resolve(packageRoot(), "slopless.textlintrc.json")]),
    "--preset",
    "slopless",
    "--rules-base-directory",
    packageNodeModules(),
    "--format",
    "json",
    ...userArgs
  ];

  if (hasFlag(userArgs, STDIN_FLAGS)) {
    return cli.execute(args, await readStdin());
  }

  return cli.execute(args);
}

process.exitCode = await main();
