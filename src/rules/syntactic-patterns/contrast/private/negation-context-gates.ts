import {
  FACTUAL_NEGATION_CONNECTORS,
  hasCommaBeforeNegation
} from "./negation-reframe-parts.js";
import type { SplitSentence } from "../../../../shared/text/sentences.js";
import type { Token } from "../../../../shared/text/tokens.js";

const INLINE_COMMA_ABSTRACT_WORDS = new Set([
  "alignment",
  "answer",
  "change",
  "clarity",
  "comfort",
  "complexity",
  "direction",
  "execution",
  "failure",
  "fix",
  "focus",
  "growth",
  "impact",
  "intention",
  "lesson",
  "meaning",
  "momentum",
  "perfection",
  "point",
  "progress",
  "purpose",
  "signal",
  "solution",
  "strategy",
  "truth",
  "value",
  "work"
]);
const META_CONTEXT_WORDS = new Set([
  "code",
  "comment",
  "commit",
  "coverage",
  "detector",
  "diff",
  "example",
  "expected",
  "filename",
  "fixture",
  "implementation",
  "literal",
  "markdown",
  "matcher",
  "normalized",
  "output",
  "prompt",
  "production",
  "quoted",
  "raw",
  "screenshot",
  "sentence",
  "string",
  "tag"
]);

export function hasAbstractCommaContrast(
  sentence: SplitSentence,
  tokens: readonly Token[],
  negationStart: number
): boolean {
  return (
    hasCommaBeforeNegation(sentence.text, negationStart) &&
    tokens.some((token) => INLINE_COMMA_ABSTRACT_WORDS.has(token.normalized))
  );
}

export function hasFactualConnectorAfterNegation(
  tokens: readonly Token[],
  negationIndex: number
): boolean {
  return tokens
    .slice(negationIndex + 1)
    .some((token) => FACTUAL_NEGATION_CONNECTORS.has(token.normalized));
}

export function hasMetaContext(tokens: readonly Token[]): boolean {
  return tokens.some((token) => META_CONTEXT_WORDS.has(token.normalized));
}
