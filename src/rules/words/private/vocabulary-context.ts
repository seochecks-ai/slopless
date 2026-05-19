import {
  findUnquotedPhraseMatches,
  type PhraseMatch
} from "../../../shared/matchers/phrases.js";
import { wordTokens } from "../../../shared/text/tokens.js";

const META_CONTEXT_WORDS = new Set([
  "banned",
  "code",
  "column",
  "customer",
  "detector",
  "example",
  "field",
  "fixture",
  "guide",
  "literal",
  "name",
  "negative",
  "prompt",
  "quoted",
  "request",
  "says",
  "span",
  "stored",
  "style",
  "test",
  "word",
  "written"
]);

const DOMAIN_CONTEXT_BY_WORD = new Map<string, ReadonlySet<string>>([
  [
    "comprehensive",
    new Set(["bicarbonate", "chloride", "panel", "potassium", "sodium"])
  ],
  [
    "landscape",
    new Set([
      "drawing",
      "drainage",
      "exterior",
      "legend",
      "map",
      "orientation",
      "portrait",
      "retaining",
      "slope",
      "wall"
    ])
  ],
  ["leverage", new Set(["customer", "guide", "quoted", "request", "style"])],
  [
    "robust",
    new Set([
      "antibiotic",
      "cotton",
      "cycle",
      "cycles",
      "physician",
      "response",
      "sample",
      "wash"
    ])
  ],
  [
    "seamless",
    new Set([
      "concrete",
      "hydraulic",
      "joints",
      "line",
      "match",
      "migration",
      "poured",
      "schemas",
      "tube",
      "walkway"
    ])
  ]
]);

function tokenWords(text: string): readonly string[] {
  return wordTokens(text).map((token) => token.normalized);
}

function hasAny(
  words: readonly string[],
  values: ReadonlySet<string>
): boolean {
  return words.some((word) => values.has(word));
}

function isMetaMention(words: readonly string[]): boolean {
  return hasAny(words, META_CONTEXT_WORDS);
}

function hasDomainContext(phrase: string, words: readonly string[]): boolean {
  const context = DOMAIN_CONTEXT_BY_WORD.get(phrase);
  return context !== undefined && hasAny(words, context);
}

export function isVocabularyContextAllowed(
  text: string,
  phrase: string
): boolean {
  const words = tokenWords(text);

  return isMetaMention(words) || hasDomainContext(phrase, words);
}

export function findVocabularyMatches(
  text: string,
  phrases: readonly string[]
): PhraseMatch[] {
  return findUnquotedPhraseMatches(text, phrases).filter(
    (match) => !isVocabularyContextAllowed(text, match.phrase.toLowerCase())
  );
}
