#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf 'FAIL %s\n' "$1" >&2
  exit 1
}

require_contains() {
  local file="$1"
  local needle="$2"
  grep -Fq "$needle" "$file" || fail "$file missing: $needle"
}

require_not_contains() {
  local file="$1"
  local needle="$2"
  if grep -Fq "$needle" "$file"; then
    fail "$file still contains: $needle"
  fi
}

require_contains README.md "https://github.com/seochecks-ai/slopless/wiki/Philosophy"
require_contains README.md "Developed by [seochecks.ai](https://seochecks.ai) to keep content specific, useful, and recognizably human."
require_not_contains README.md "agent-quality-controls%2Fslopless"
require_not_contains README.md "https://github.com/agent-quality-controls/slopless/wiki/"
require_not_contains README.md "Part of [Agent Quality Controls](https://github.com/agent-quality-controls)."

node -e '
const fs = require("node:fs");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
if (pkg.repository?.url !== "git+https://github.com/seochecks-ai/slopless.git") {
  throw new Error(`bad repository.url: ${pkg.repository?.url}`);
}
if (pkg.homepage !== "https://github.com/seochecks-ai/slopless#readme") {
  throw new Error(`bad homepage: ${pkg.homepage}`);
}
if (pkg.bugs?.url !== "https://github.com/seochecks-ai/slopless/issues") {
  throw new Error(`bad bugs.url: ${pkg.bugs?.url}`);
}
'

require_contains .github/ISSUE_TEMPLATE/config.yml "https://github.com/seochecks-ai/slopless/discussions"
require_not_contains .github/ISSUE_TEMPLATE/config.yml "https://github.com/agent-quality-controls/slopless/discussions"
require_contains .github/CONTRIBUTING.md "git clone https://github.com/seochecks-ai/slopless.git"
require_not_contains .github/CONTRIBUTING.md "git clone https://github.com/agent-quality-controls/slopless.git"

remote_url="$(git remote get-url origin)"
if [[ "$remote_url" != "https://github.com/seochecks-ai/slopless.git" ]]; then
  fail "origin remote is $remote_url"
fi

repo_json="$(gh repo view seochecks-ai/slopless --json nameWithOwner,defaultBranchRef,description,homepageUrl,hasIssuesEnabled,hasWikiEnabled,hasDiscussionsEnabled,repositoryTopics)"
node -e '
const repo = JSON.parse(process.argv[1]);
const topics = repo.repositoryTopics.map((topic) => topic.name).sort();
const expected = ["ai","cli","lint","linter","llm","markdown","nodejs","prose","quality","slop","static-analysis","style-guide","textlint","typescript","writing"].sort();
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
assert(repo.nameWithOwner === "seochecks-ai/slopless", `bad repo ${repo.nameWithOwner}`);
assert(repo.defaultBranchRef.name === "main", `bad default branch ${repo.defaultBranchRef.name}`);
assert(repo.description === "Deterministic textlint rules and CLI for catching prose slop in Markdown", `bad description ${repo.description}`);
assert(repo.homepageUrl === "https://www.npmjs.com/package/slopless", `bad homepage ${repo.homepageUrl}`);
assert(repo.hasIssuesEnabled === true, "issues disabled");
assert(repo.hasWikiEnabled === true, "wiki disabled");
assert(repo.hasDiscussionsEnabled === true, "discussions disabled");
assert(JSON.stringify(topics) === JSON.stringify(expected), `bad topics ${JSON.stringify(topics)}`);
' "$repo_json"

actions_json="$(gh api repos/seochecks-ai/slopless/actions/permissions)"
node -e '
const actions = JSON.parse(process.argv[1]);
if (actions.enabled !== true) throw new Error("actions disabled");
' "$actions_json"

gh api repos/seochecks-ai/slopless/vulnerability-alerts >/dev/null
gh api repos/seochecks-ai/slopless/branches/main/protection >/dev/null
gh repo view seochecks-ai/.github --json nameWithOwner,description,defaultBranchRef >/dev/null

printf 'PASS seochecks-ai migration\n'
