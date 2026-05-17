[Vale](https://github.com/errata-ai/vale) is an open source prose linter that can check the content of documents in several formats against style guide rules. The goal of a prose linter is automating style guide checks in docs-as-code environments, so that style issues are detected before deploy or while editing documentation in a code editor. 

This repo contains a set of linting rules for Vale based on the Elastic style guide and recommendations.

## Get started

Run these commands to install the Elastic style guide locally:

**macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/elastic/vale-rules/main/install-macos.sh | bash
```

**Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/elastic/vale-rules/main/install-linux.sh | bash
```

**Windows (PowerShell):**
```powershell
Invoke-WebRequest -Uri https://raw.githubusercontent.com/elastic/vale-rules/main/install-windows.ps1 -OutFile install-windows.ps1
powershell -ExecutionPolicy Bypass -File .\install-windows.ps1
```

### Installer options

The macOS installer supports the following flags:

| Flag | Description |
|------|-------------|
| `--enable-spelling` | Enable the experimental `Elastic.Spelling` rule. |
| `--help` | Show usage information. |

For example, to install with spelling checks enabled:

```bash
curl -fsSL https://raw.githubusercontent.com/elastic/vale-rules/main/install-macos.sh | bash -s -- --enable-spelling
```

## Install the VS Code extension

Install the [Vale VSCode](https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode) extension to view Vale checks when saving a document.

## Add the Vale action to your repo

Add the Elastic Vale linter to your repository's CI/CD pipeline using a two-workflow setup that supports fork PRs:

```yaml
# .github/workflows/vale-lint.yml
name: Vale Documentation Linting

on:
  pull_request:
    paths:
      - 'docs/**/*.md'
      - 'docs/**/*.adoc'

permissions:
  contents: read

jobs:
  vale:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Run Vale Linter
        uses: elastic/vale-rules/lint@main
```

### Action inputs

The lint action supports these inputs:

| Input | Description | Default |
|-------|-------------|---------|
| `files` | Files or directories to lint (space-separated). If not provided, lints changed files in PR. | `''` |
| `vale-paths` | Paths to include for linting (multi-line or space-separated). Supports glob patterns and `!` negation to exclude paths. Only files matching these paths will be linted. | `''` |
| `fail_on_error` | Fail the action if Vale finds error-level issues. | `'false'` |
| `vale_version` | Vale version to install. | `'latest'` |
| `debug` | Enable debug output. | `'false'` |
| `upload_artifact` | Upload Vale results as a workflow artifact. | `'true'` |
| `artifact_name` | Name for the uploaded artifact. | `'vale-results'` |

### Action outputs

| Output | Description |
|--------|-------------|
| `artifact_uploaded` | `true` if Vale results were uploaded as an artifact, `false` otherwise. |

### Per-repo rule overrides

You can customize which Vale rules are enabled, disabled, or set to a different severity on a per-repo basis. Add a `.vale-overrides.ini` file to your repository root (or `.github/.vale-overrides.ini`):

```ini
Elastic.Spelling = YES
Elastic.We = suggestion
```

The lint action automatically detects this file and merges it into the Vale configuration. For existing keys, values are replaced in place. For new keys, they are inserted into the `[*.md]` section. Section headers in the override file are ignored.

### Filtering specific paths

Use `vale-paths` to limit linting to specific directories. This is useful when multiple teams share a docs folder:

```yaml
- name: Run Vale Linter
  uses: elastic/vale-rules/lint@main
  with:
    vale-paths: |
      docs/team-a
      docs/team-b
```

With glob patterns:

```yaml
- name: Run Vale Linter
  uses: elastic/vale-rules/lint@main
  with:
    vale-paths: |
      docs/guides/**
      docs/reference/**
```

With negation patterns to exclude specific subdirectories:

```yaml
- name: Run Vale Linter
  uses: elastic/vale-rules/lint@main
  with:
    vale-paths: |
      docs/reference/**
      !docs/reference/query-languages/esql/**
```

Space-separated format is also supported: `vale-paths: "docs/team-a docs/team-b"`

> **Note:** The `include-paths` input still works but is deprecated. Use `vale-paths` instead for consistency with `docs-actions` workflows.

```yaml
# .github/workflows/vale-report.yml
name: Vale Report

on:
  workflow_run:
    workflows: ["Vale Documentation Linting"]
    types:
      - completed

permissions:
  pull-requests: read

jobs:
  report:
    runs-on: ubuntu-latest
    if: github.event.workflow_run.event == 'pull_request'
    permissions:
      pull-requests: write
    
    steps:
      - name: Post Vale Results
        uses: elastic/vale-rules/report@main
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

This two-workflow approach ensures fork PRs are linted safely while still posting results as PR comments.

Refer to [ACTION_USAGE.md](ACTION_USAGE.md) for detailed documentation and examples.

## Spelling rule (experimental)

The `Elastic.Spelling` rule checks documentation for misspellings using Vale's built-in Hunspell-based spell checker with the American English dictionary. It is **disabled by default** and can be enabled per repo or per local installation.

The rule includes regex filters to reduce false positives common in technical documentation (camelCase identifiers, uppercase acronyms, CLI flags, file extensions, underscore-prefixed Elasticsearch fields, and more). Three vocabulary files provide additional accepted terms:

- **ElasticTerms** — Elastic product names, features, and abbreviations.
- **ThirdPartyProducts** — Vendor names, third-party tools, and integrations.
- **TechJargon** — Generic computing, networking, and development terms.

### Enable spelling in CI

Add a `.vale-overrides.ini` to your repository root:

```ini
Elastic.Spelling = YES
```

The lint action picks this up automatically. No workflow changes are needed.

### Enable spelling locally

Pass the `--enable-spelling` flag when installing or updating:

```bash
# macOS
curl -fsSL https://raw.githubusercontent.com/elastic/vale-rules/main/install-macos.sh | bash -s -- --enable-spelling
```

Or add the override manually to your local Vale config:

```ini
[*.md]
Elastic.Spelling = YES
```

## Security considerations for CI workflows

The lint action processes PR content. Follow these guidelines when setting up your workflows:

- **Use `pull_request`, not `pull_request_target`**, for the lint workflow.
- **Set `persist-credentials: false`** on the checkout step. The lint action does not need git credentials after checkout.
- **Set minimal `permissions`**: the lint workflow only needs `contents: read`. Only the report workflow (via `workflow_run`) needs `pull-requests: write`.

The `.vale-overrides.ini` feature only allows overriding rule-level settings (`Elastic.*` rules and `MinAlertLevel`). Structural config keys like `StylesPath`, `BasedOnStyles`, and `Packages` cannot be overridden.

## Folder structure

- `lint/action.yml` - GitHub Composite Action for running the Vale linter.
- `report/action.yml` - GitHub Composite Action for posting Vale results as PR comments.
- `ACTION_USAGE.md` - Detailed documentation for using the GitHub Action.
- `install-macos.sh` - Automated installation script for macOS.
- `install-linux.sh` - Automated installation script for Linux.
- `install-windows.ps1` - Automated installation script for Windows.
- `styles/Elastic/` - Elastic linting rules for Vale. See [Styles](https://vale.sh/docs/topics/styles/).
- `styles/config/vocabularies/` - Vocabulary files for accepted terms (ElasticTerms, ThirdPartyProducts, TechJargon).
- `.github/workflows/` - CI/CD workflows for testing and releases.

The installation scripts create Vale configurations at platform-specific locations:

**macOS:**
- `~/Library/Application Support/vale/.vale.ini` - Vale configuration file
- `~/Library/Application Support/vale/styles/Elastic/` - Elastic style rules

**Linux:**
- `~/.config/vale/.vale.ini` - Vale configuration file
- `~/.local/share/vale/styles/Elastic/` - Elastic style rules

**Windows:**
- `%LOCALAPPDATA%\vale\.vale.ini` - Vale configuration file
- `%LOCALAPPDATA%\vale\styles\Elastic\` - Elastic style rules

## Updating

To update to the latest style guide rules, rerun the installation script.

## Testing locally

You can test Vale rules locally without creating a release. This is useful for developing and testing new rules or modifications to existing ones.

### Prerequisites

1. Install Vale on your system (use the installation scripts above, or install directly from [Vale's installation guide](https://vale.sh/docs/vale-cli/installation/)).
2. Clone this repository.

### Testing workflow

The repository includes a `.vale.ini` configuration file at the root that points to the local `styles/` directory:

```bash
# Navigate to the repository
cd /path/to/elastic-style-guide

# Create a test Markdown file
echo "This uses eg, instead of for example." > test.md

# Run Vale using the local configuration
vale --config=.vale.ini test.md
```

Vale immediately uses the rules from the local `styles/Elastic/` directory. Any changes you make to rule files are reflected instantly without needing to create a release.

### Testing rule changes

1. Edit any rule file in `styles/Elastic/`:

```bash
# Example: modify the Latinisms rule
vim styles/Elastic/Latinisms.yml
```

2. Run Vale against a test file:

```bash
vale --config=.vale.ini your-test-file.md
```

3. Iterate on your changes until the rule works as expected.

The local `.vale.ini` configuration uses `StylesPath = styles`, which points directly to the local directory, so there's no need for releases or package syncing during development.

## Creating releases

To create a new release of the Vale package, you have two options:

### Option 1: Manual workflow dispatch (recommended)

1. Go to the [Actions tab](https://github.com/elastic/vale-rules/actions/workflows/release.yml) in GitHub
2. Click "Run workflow"
3. Enter the version number (e.g., `v1.0.1`)
4. Click "Run workflow"

The GitHub workflow will automatically:
- Create and push a git tag with the specified version
- Add a VERSION file to the Elastic style directory
- Package the `.vale.ini` and `styles/` folder into `elastic-vale.zip` (a Vale complete package)
- Create a new GitHub release with the version tag
- Upload the package as a release asset

### Option 2: Push a tag manually

1. Update the version and make your changes.
2. Commit and push your changes to the main branch.
3. Create and push a version tag:

```bash
git tag v1.0.1
git push origin v1.0.1
```

The GitHub workflow automatically:

- Adds a VERSION file to the Elastic style directory.
- Packages the `.vale.ini` and `styles/` folder into `elastic-vale.zip` (a Vale complete package).
- Creates a new GitHub release with the version tag.
- Uploads the package as a release asset.

Users can then install or update to this version using the installation scripts or by running `vale sync`. The packaged `.vale.ini` ensures everyone gets the same configuration settings (SkippedScopes, IgnoredScopes, TokenIgnores, etc.).

## Resources

- [Vale's official documentation](https://vale.sh/docs/vale-cli/overview/)
- [Regex101, a web-based regular expressions editor](https://regex101.com/)

## License

This software is licensed under the Apache License 2.0. Refer to the LICENSE file for details.
