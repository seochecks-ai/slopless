import { cleanSentence } from "../../../shared/matchers/prose-patterns.js";
import { hasConcreteCausalSummary } from "../../../shared/matchers/concrete-evidence.js";
import { wordTokens, type Token } from "../../../shared/text/tokens.js";
import {
  hasConcreteExplanation,
  shouldRejectConcreteEvidence
} from "./concrete-guards.js";

export type SemanticThinnessPattern = {
  readonly class: string;
  readonly id: string;
  readonly matchMode?: string;
  readonly maxTokens?: number;
  readonly purpose: string;
  readonly slots: Readonly<Record<string, readonly string[]>>;
  readonly templates: readonly string[];
};

export type SemanticThinnessMatch = {
  readonly patternClass: string;
  readonly patternId: string;
  readonly purpose: string;
  readonly signal: string;
};

type TemplatePart =
  | {
      readonly kind: "literal";
      readonly tokens: readonly string[];
    }
  | {
      readonly kind: "slot";
      readonly name: string;
    };

type CompiledTemplate = {
  readonly parts: readonly TemplatePart[];
  readonly signal: string;
};

type CompiledPattern = {
  readonly class: string;
  readonly id: string;
  readonly matchMode: "contains" | "full";
  readonly maxTokens: number;
  readonly purpose: string;
  readonly slotValues: Readonly<Record<string, readonly (readonly string[])[]>>;
  readonly templates: readonly CompiledTemplate[];
};

const CONTAINS_MAX_TOKENS = 80;
const FULL_MAX_TOKENS = 12;
const REJECT_TOKENS = new Set([
  "because",
  "therefore",
  "unless",
  "when",
  "whenever",
  "whereas",
  "which",
  "while"
]);
const BROAD_PATTERN_IDS = new Set([
  "abstract-personification-line",
  "body-emotion-shorthand",
  "deictic-summary",
  "empty-scene-state",
  "empty-scene-transition",
  "gaze-choreography",
  "generic-pressure-or-stakes",
  "generic-realization",
  "hollow-significance",
  "puffery-evaluative-claim",
  "real-work-begins",
  "truth-answer-moves",
  "vague-threshold-change"
]);
const CONNECTOR_ALLOWED_PATTERN_IDS = new Set([
  "recursive-meaning-frame",
  "vague-summary-cost"
]);
function normalizedTokens(text: string): readonly string[] {
  return wordTokens(text).map((token) => token.normalized);
}

function flushLiteral(parts: TemplatePart[], literal: string): void {
  const tokens = normalizedTokens(literal);
  if (tokens.length > 0) {
    parts.push({ kind: "literal", tokens });
  }
}

function readSlotName(template: string, start: number): [string, number] {
  let name = "";
  let index = start + 1;

  while (index < template.length) {
    const character = template[index];
    if (character === "}") {
      return [name, index + 1];
    }
    name += character ?? "";
    index += 1;
  }

  return [name, index];
}

function compileTemplate(template: string): CompiledTemplate {
  const parts: TemplatePart[] = [];
  let literal = "";
  let index = 0;

  while (index < template.length) {
    const character = template[index];
    if (character === "{") {
      flushLiteral(parts, literal);
      literal = "";
      const [name, nextIndex] = readSlotName(template, index);
      parts.push({ kind: "slot", name });
      index = nextIndex;
      continue;
    }

    literal += character ?? "";
    index += 1;
  }

  flushLiteral(parts, literal);
  return { parts, signal: template };
}

function compileSlotValues(
  slots: Readonly<Record<string, readonly string[]>>
): Readonly<Record<string, readonly (readonly string[])[]>> {
  const compiled: Record<string, readonly (readonly string[])[]> = {};

  for (const [name, values] of Object.entries(slots)) {
    compiled[name] = values.map((value) => normalizedTokens(value));
  }

  return compiled;
}

export function compileSemanticThinnessPatterns(
  patterns: readonly SemanticThinnessPattern[]
): readonly CompiledPattern[] {
  const matchModeFor = (
    pattern: SemanticThinnessPattern
  ): "contains" | "full" =>
    pattern.matchMode === "contains" ? "contains" : "full";

  const defaultMaxTokensFor = (pattern: SemanticThinnessPattern): number =>
    matchModeFor(pattern) === "contains"
      ? CONTAINS_MAX_TOKENS
      : FULL_MAX_TOKENS;

  return patterns.map((pattern) => ({
    class: pattern.class,
    id: pattern.id,
    matchMode: matchModeFor(pattern),
    maxTokens: pattern.maxTokens ?? defaultMaxTokensFor(pattern),
    purpose: pattern.purpose,
    slotValues: compileSlotValues(pattern.slots),
    templates: pattern.templates.map((template) => compileTemplate(template))
  }));
}

function shouldRejectCommon(text: string, tokens: readonly Token[]): boolean {
  return tokens.length === 0 || shouldRejectConcreteEvidence(text, tokens);
}

function shouldRejectForPattern(
  pattern: CompiledPattern,
  tokens: readonly Token[]
): boolean {
  if (tokens.length > pattern.maxTokens) {
    return true;
  }

  return (
    (!CONNECTOR_ALLOWED_PATTERN_IDS.has(pattern.id) &&
      tokens.some((token) => REJECT_TOKENS.has(token.normalized))) ||
    (BROAD_PATTERN_IDS.has(pattern.id) && hasConcreteExplanation(tokens))
  );
}

function tokensMatchAt(
  source: readonly Token[],
  expected: readonly string[],
  start: number
): boolean {
  if (start + expected.length > source.length) {
    return false;
  }

  for (let index = 0; index < expected.length; index += 1) {
    if (source[start + index]?.normalized !== expected[index]) {
      return false;
    }
  }

  return true;
}

function matchPart(
  source: readonly Token[],
  pattern: CompiledPattern,
  part: TemplatePart,
  tokenIndex: number
): readonly number[] {
  if (part.kind === "literal") {
    return tokensMatchAt(source, part.tokens, tokenIndex)
      ? [tokenIndex + part.tokens.length]
      : [];
  }

  return (pattern.slotValues[part.name] ?? [])
    .filter((tokens) => tokensMatchAt(source, tokens, tokenIndex))
    .map((tokens) => tokenIndex + tokens.length);
}

function templateMatches(
  source: readonly Token[],
  pattern: CompiledPattern,
  template: CompiledTemplate,
  start: number
): boolean {
  let positions: readonly number[] = [start];

  for (const part of template.parts) {
    positions = positions.flatMap((position) =>
      matchPart(source, pattern, part, position)
    );
    if (positions.length === 0) {
      return false;
    }
  }

  if (pattern.matchMode === "contains") {
    return positions.length > 0;
  }

  return positions.includes(source.length);
}

function templateMatchesPattern(
  source: readonly Token[],
  pattern: CompiledPattern,
  template: CompiledTemplate
): boolean {
  if (pattern.matchMode === "full") {
    return templateMatches(source, pattern, template, 0);
  }

  for (let start = 0; start < source.length; start += 1) {
    if (templateMatches(source, pattern, template, start)) {
      return true;
    }
  }

  return false;
}

function matchCompiledPattern(
  tokens: readonly Token[],
  pattern: CompiledPattern,
  text: string
): SemanticThinnessMatch | undefined {
  if (
    shouldRejectForPattern(pattern, tokens) ||
    (BROAD_PATTERN_IDS.has(pattern.id) && hasConcreteCausalSummary(text))
  ) {
    return undefined;
  }

  for (const template of pattern.templates) {
    if (templateMatchesPattern(tokens, pattern, template)) {
      return {
        patternClass: pattern.class,
        patternId: pattern.id,
        purpose: pattern.purpose,
        signal: template.signal
      };
    }
  }

  return undefined;
}

export function findSemanticThinnessMatch(
  text: string,
  patterns: readonly CompiledPattern[]
): SemanticThinnessMatch | undefined {
  const cleaned = cleanSentence(text, ["and ", "but ", "so "]);
  const tokens = wordTokens(cleaned);

  if (shouldRejectCommon(cleaned, tokens)) {
    return undefined;
  }

  for (const pattern of patterns) {
    const match = matchCompiledPattern(tokens, pattern, cleaned);
    if (match !== undefined) {
      return match;
    }
  }

  return undefined;
}
