import {
  DO_NEGATIONS,
  EXPLICIT_DO_AUXILIARIES,
  skipOptionalAdverbs,
  startsWithWords,
  validSubject,
  words
} from "./negation-reframe-parts.js";
import type { Token } from "../../../../shared/text/tokens.js";

function startsWithMeaningAffirmative(
  bTokens: readonly Token[],
  subject: readonly string[]
): boolean {
  return (
    startsWithWords(bTokens, [...subject, "means"]) ||
    startsWithWords(bTokens, [...subject, "mean"]) ||
    startsWithWords(bTokens, [...subject, "does", "mean"]) ||
    startsWithWords(bTokens, [...subject, "do", "mean"]) ||
    startsWithWords(bTokens, ["it", "means"]) ||
    startsWithWords(bTokens, ["it", "does", "mean"]) ||
    startsWithWords(bTokens, ["this", "means"]) ||
    startsWithWords(bTokens, ["this", "does", "mean"]) ||
    startsWithWords(bTokens, ["that", "does", "mean"]) ||
    startsWithWords(bTokens, ["that", "means"])
  );
}

function hasNegatedVerb(
  tokenWords: readonly string[],
  index: number,
  verb: string
): boolean {
  const current = tokenWords[index];
  const next = tokenWords[index + 1];

  if (DO_NEGATIONS.has(current ?? "")) {
    return tokenWords[skipOptionalAdverbs(tokenWords, index + 1)] === verb;
  }

  return (
    EXPLICIT_DO_AUXILIARIES.has(current ?? "") &&
    next === "not" &&
    tokenWords[skipOptionalAdverbs(tokenWords, index + 2)] === verb
  );
}

function negatedVerbReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[],
  verb: string
): boolean {
  const tokenWords = words(aTokens);

  for (let index = 0; index < tokenWords.length; index += 1) {
    const subject = tokenWords.slice(0, index);

    if (
      validSubject(subject) &&
      hasNegatedVerb(tokenWords, index, verb) &&
      startsWithMeaningAffirmative(bTokens, subject)
    ) {
      return true;
    }
  }

  return false;
}

export function meaningReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  return negatedVerbReframe(aTokens, bTokens, "mean");
}

export function makeMeaningReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  return negatedVerbReframe(aTokens, bTokens, "make");
}
