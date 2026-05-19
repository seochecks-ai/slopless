#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEXTLINT="$ROOT/node_modules/.bin/textlint"

cd "$ROOT"
pnpm run build >/dev/null

cd "$ROOT"

if [ "$#" -eq 0 ]; then
  mapfile -t FILES < <(find behavior/fixtures/textlint-rules/cases behavior/fixtures/textlint-rules/corpus -name "*.md" | sort)
else
  FILES=("$@")
fi

CONFIG_ARGS=(--no-textlintrc)
RULE_ARGS=(
  --rulesdir "$ROOT/dist/rules/academic-slop"
  --rulesdir "$ROOT/dist/rules/metrics"
  --rulesdir "$ROOT/dist/rules/narrative-slop"
  --rulesdir "$ROOT/dist/rules/orthography"
  --rulesdir "$ROOT/dist/rules/words"
  --rulesdir "$ROOT/dist/rules/phrases"
  --rulesdir "$ROOT/dist/rules/semantic-thinness"
  --rulesdir "$ROOT/dist/rules/term-policy"
  --rulesdir "$ROOT/dist/rules/syntactic-patterns/authority"
  --rulesdir "$ROOT/dist/rules/syntactic-patterns/closers"
  --rulesdir "$ROOT/dist/rules/syntactic-patterns/contrast"
  --rulesdir "$ROOT/dist/rules/syntactic-patterns/generalization"
  --rulesdir "$ROOT/dist/rules/syntactic-patterns/lead-ins"
  --rulesdir "$ROOT/dist/rules/syntactic-patterns/llm-artifacts"
  --rulesdir "$ROOT/dist/rules/syntactic-patterns/repetition"
)
run_textlint_json() {
  local output="$1"
  shift

  set +e
  "$TEXTLINT" "$@" --format json >"$output"
  local status="$?"
  set -e

  if [ "$status" -ne 0 ] && [ "$status" -ne 1 ]; then
    cat "$output" >&2
    return "$status"
  fi
}

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

JSON_OUTPUTS=()
DEFAULT_OUTPUT="$TMP_DIR/default.json"
run_textlint_json "$DEFAULT_OUTPUT" "${CONFIG_ARGS[@]}" "${RULE_ARGS[@]}" "${FILES[@]}"
JSON_OUTPUTS+=("$DEFAULT_OUTPUT")

safe_output_name() {
  local path="$1"
  path="${path//\//__}"
  path="${path//[^A-Za-z0-9_.-]/_}"
  printf '%s' "$path"
}

for FILE in "${FILES[@]}"; do
  if [ -f "$(dirname "$FILE")/.textlintrc.json" ]; then
    FIXTURE_CONFIG="$(dirname "$FILE")/.textlintrc.json"
    FAMILY="$(basename "$(dirname "$FILE")")"
    CONFIG_OUTPUT="$TMP_DIR/config-$FAMILY-$(safe_output_name "$FILE").json"
    run_textlint_json \
      "$CONFIG_OUTPUT" \
      --config "$FIXTURE_CONFIG" \
      --rules-base-directory "$ROOT/dist/rules/$FAMILY" \
      "$FILE"
    JSON_OUTPUTS+=("$CONFIG_OUTPUT")
  fi

  FILE_BASE="${FILE%.md}"
  for FIXTURE_CONFIG in "$FILE_BASE".*.textlintrc.json; do
    if [ ! -f "$FIXTURE_CONFIG" ]; then
      continue
    fi

    FAMILY="${FIXTURE_CONFIG#"$FILE_BASE".}"
    FAMILY="${FAMILY%.textlintrc.json}"
    CONFIG_OUTPUT="$TMP_DIR/config-$FAMILY-$(safe_output_name "$FILE").json"
    run_textlint_json \
      "$CONFIG_OUTPUT" \
      --config "$FIXTURE_CONFIG" \
      --rules-base-directory "$ROOT/dist/rules/$FAMILY" \
      "$FILE"
    JSON_OUTPUTS+=("$CONFIG_OUTPUT")
  done
done

jq -s 'flatten
  | group_by(.filePath)
  | map(.[0] + {
      messages: (
        map(.messages // [])
        | add
        | sort_by(.line, .column, (.range[0] // null), (.range[1] // null), .ruleId, .message)
      )
    })
  | sort_by((.filePath | split("/")[-1]), .filePath)' "${JSON_OUTPUTS[@]}"
