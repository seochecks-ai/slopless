import type { Token } from "../../../../shared/text/tokens.js";
import {
  DO_NEGATIONS,
  EXPLICIT_DO_AUXILIARIES,
  FACTUAL_NEGATION_CONNECTORS,
  PRONOUN_REFRAME_STARTS,
  hasAnyWord,
  skipOptionalAdverbs,
  startsWithAny,
  startsWithSubjectOrPronoun,
  startsWithWords,
  stripLeadingPairPivot,
  validSubject,
  words
} from "./negation-reframe-parts.js";

const GENERIC_ACTION_VERBS = new Set([
  "asked",
  "built",
  "called",
  "crossed",
  "found",
  "gave",
  "left",
  "looked",
  "made",
  "moved",
  "opened",
  "pointed",
  "pulled",
  "said",
  "sat",
  "stood",
  "took",
  "turned",
  "walked",
  "went"
]);

function startsWithPassiveCopula(tokens: readonly Token[]): boolean {
  const tokenWords = words(tokens);
  const predicateIndex = startsWithAny(tokens, PRONOUN_REFRAME_STARTS)
    ? skipOptionalAdverbs(tokenWords, 2)
    : undefined;

  return tokenWords[predicateIndex ?? -1]?.endsWith("ed") === true;
}

function noLongerCopularReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const tokenWords = words(aTokens);

  for (let index = 0; index < tokenWords.length - 2; index += 1) {
    const current = tokenWords[index];
    const subject = tokenWords.slice(0, index);

    if (
      current === undefined ||
      !validSubject(subject) ||
      current !== "was" ||
      tokenWords[index + 1] !== "no" ||
      tokenWords[index + 2] !== "longer"
    ) {
      continue;
    }

    return (
      startsWithSubjectOrPronoun(bTokens, subject) &&
      !startsWithPassiveCopula(bTokens)
    );
  }

  return false;
}

function fragmentDefinitionReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const tokenWords = words(aTokens);

  if (
    tokenWords[0] !== "not" ||
    !["a", "an", "the"].includes(tokenWords[1] ?? "") ||
    tokenWords.length > 8
  ) {
    return false;
  }

  return (
    startsWithAny(bTokens, PRONOUN_REFRAME_STARTS) ||
    startsWithWords(bTokens, ["a"]) ||
    startsWithWords(bTokens, ["an"]) ||
    startsWithWords(bTokens, ["the"])
  );
}

function negatedActionSubject(
  tokens: readonly Token[]
): readonly string[] | undefined {
  const tokenWords = words(tokens);

  for (let index = 0; index < tokenWords.length; index += 1) {
    const current = tokenWords[index];
    const next = tokenWords[index + 1];
    const subject = tokenWords.slice(0, index);

    if (!validSubject(subject)) {
      continue;
    }

    if (DO_NEGATIONS.has(current ?? "")) {
      return subject;
    }

    if (EXPLICIT_DO_AUXILIARIES.has(current ?? "") && next === "not") {
      return subject;
    }
  }

  return undefined;
}

function negativeActionReplacement(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const tokenWords = words(aTokens);
  const subject = negatedActionSubject(aTokens);
  if (subject === undefined) {
    return false;
  }

  const bContentTokens = stripLeadingPairPivot(bTokens);
  const bWords = words(bContentTokens);
  const verbIndex = skipOptionalAdverbs(bWords, subject.length);
  const verb = bWords[verbIndex];

  return (
    tokenWords.length <= 14 &&
    !hasAnyWord(tokenWords, FACTUAL_NEGATION_CONNECTORS) &&
    startsWithSubjectOrPronoun(bContentTokens, subject) &&
    verb !== undefined &&
    GENERIC_ACTION_VERBS.has(verb)
  );
}

export function hasNegativeSlopPairSignal(tokens: readonly Token[]): boolean {
  const tokenWords = words(tokens);

  return tokenWords.some(
    (token, index) => token === "no" && tokenWords[index + 1] === "longer"
  );
}

export function negativeSlopReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  return (
    noLongerCopularReframe(aTokens, bTokens) ||
    fragmentDefinitionReframe(aTokens, bTokens) ||
    negativeActionReplacement(aTokens, bTokens)
  );
}
