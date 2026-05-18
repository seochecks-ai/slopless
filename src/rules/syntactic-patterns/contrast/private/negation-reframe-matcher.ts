import {
  DO_NEGATIONS,
  EXPLICIT_DO_AUXILIARIES,
  NEGATION_WORDS,
  PASSIVE_DEFINITION_VERBS,
  PRONOUN_REFRAME_STARTS,
  contrastPivotSubject,
  findCopularNegation,
  findNegationIndex,
  hasCommaBeforeNegation,
  isCompleteSentence,
  skipOptionalAdverbs,
  startsWithAny,
  startsWithSubjectOrPronoun,
  startsWithSubjectVerb,
  startsWithWords,
  stripLeadingPairPivot,
  validSubject,
  words
} from "./negation-reframe-parts.js";
import {
  hasNegativeSlopPairSignal,
  negativeSlopReframe
} from "./negative-slop-frames.js";
import { makeMeaningReframe, meaningReframe } from "./meaning-reframe.js";
import {
  splitSentences,
  type SplitSentence
} from "../../../../shared/text/sentences.js";
import { wordTokens, type Token } from "../../../../shared/text/tokens.js";

export type NegationReframeMatch = {
  readonly end: number;
  readonly start: number;
  readonly text: string;
};

const INLINE_NON_CONTRAST_NEGATION_FOLLOWERS = new Set([
  "all",
  "any",
  "every",
  "too"
]);
function inlineNegationContrast(
  sentence: SplitSentence
): NegationReframeMatch | undefined {
  const tokens = wordTokens(sentence.text);
  const negationIndex = findNegationIndex(tokens);

  if (negationIndex === undefined) {
    return undefined;
  }

  const negation = tokens[negationIndex];

  if (
    negation?.normalized !== "not" ||
    INLINE_NON_CONTRAST_NEGATION_FOLLOWERS.has(
      tokens[negationIndex + 1]?.normalized ?? ""
    ) ||
    !hasCommaBeforeNegation(sentence.text, negation.start)
  ) {
    return undefined;
  }

  return {
    end: sentence.end,
    start: sentence.start,
    text: sentence.text
  };
}

function sameSubjectCopularReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const negation = findCopularNegation(aTokens);

  if (negation === undefined || !validSubject(negation.subject)) {
    return false;
  }

  return startsWithWords(bTokens, [
    ...negation.subject,
    negation.affirmativeAux
  ]);
}

function pronounCopularReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const negation = findCopularNegation(aTokens);

  return (
    negation !== undefined &&
    validSubject(negation.subject) &&
    !looksLikePassiveDefinition(aTokens, bTokens) &&
    !startsWithNegatedPronounCopula(bTokens) &&
    startsWithAny(bTokens, PRONOUN_REFRAME_STARTS)
  );
}

function startsWithNegatedPronounCopula(tokens: readonly Token[]): boolean {
  for (const start of PRONOUN_REFRAME_STARTS) {
    if (!startsWithWords(tokens, start)) {
      continue;
    }

    const tokenWords = words(tokens);
    const predicateIndex = skipOptionalAdverbs(tokenWords, start.length);

    return NEGATION_WORDS.has(tokenWords[predicateIndex] ?? "");
  }

  return false;
}

function progressiveVerbMirror(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const negation = findCopularNegation(aTokens);

  if (negation === undefined || !validSubject(negation.subject)) {
    return false;
  }

  const tokenWords = words(aTokens);
  const predicateIndex = skipOptionalAdverbs(
    tokenWords,
    negation.negatedPredicateStart
  );
  const verb = tokenWords[predicateIndex];

  return (
    verb !== undefined &&
    verb.endsWith("ing") &&
    startsWithWords(bTokens, [
      ...negation.subject,
      negation.affirmativeAux,
      verb
    ])
  );
}

function needReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const tokenWords = words(aTokens);

  for (let index = 0; index < tokenWords.length; index += 1) {
    const current = tokenWords[index];
    const next = tokenWords[index + 1];
    const subject = tokenWords.slice(0, index);

    if (!validSubject(subject)) {
      continue;
    }

    if (DO_NEGATIONS.has(current ?? "") && tokenWords[index + 1] === "need") {
      return startsWithNeedAffirmative(bTokens, subject);
    }

    if (
      EXPLICIT_DO_AUXILIARIES.has(current ?? "") &&
      next === "not" &&
      tokenWords[index + 2] === "need"
    ) {
      return startsWithNeedAffirmative(bTokens, subject);
    }
  }

  return false;
}

function startsWithNeedAffirmative(
  bTokens: readonly Token[],
  subject: readonly string[]
): boolean {
  return (
    startsWithWords(bTokens, [...subject, "need"]) ||
    startsWithWords(bTokens, [...subject, "needs"]) ||
    startsWithWords(bTokens, ["they", "need"]) ||
    startsWithWords(bTokens, ["you", "need"]) ||
    startsWithWords(bTokens, ["we", "need"])
  );
}

function actionVerbMirror(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const tokenWords = words(aTokens);
  const bContentTokens = stripLeadingPairPivot(bTokens);

  for (let index = 0; index < tokenWords.length; index += 1) {
    const current = tokenWords[index];
    const next = tokenWords[index + 1];
    const subject = tokenWords.slice(0, index);

    if (!validSubject(subject)) {
      continue;
    }

    if (DO_NEGATIONS.has(current ?? "")) {
      const verbIndex = skipOptionalAdverbs(tokenWords, index + 1);
      const verb = tokenWords[verbIndex];

      if (
        verb !== undefined &&
        startsWithSubjectVerb(bContentTokens, subject, verb)
      ) {
        return true;
      }
    }

    if (EXPLICIT_DO_AUXILIARIES.has(current ?? "") && next === "not") {
      const verbIndex = skipOptionalAdverbs(tokenWords, index + 2);
      const verb = tokenWords[verbIndex];

      if (
        verb !== undefined &&
        startsWithSubjectVerb(bContentTokens, subject, verb)
      ) {
        return true;
      }
    }
  }

  return false;
}

function explicitContrastPivotReframe(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const subject = contrastPivotSubject(aTokens);

  return (
    subject !== undefined &&
    !startsWithNegatedPronounCopula(bTokens) &&
    startsWithSubjectOrPronoun(bTokens, subject)
  );
}

function hasPairNegationSignal(tokens: readonly Token[]): boolean {
  return (
    findNegationIndex(tokens) !== undefined ||
    contrastPivotSubject(tokens) !== undefined ||
    hasNegativeSlopPairSignal(tokens)
  );
}

function looksLikePassiveDefinition(
  aTokens: readonly Token[],
  bTokens: readonly Token[]
): boolean {
  const aWords = words(aTokens);
  const bWords = words(bTokens);

  for (let index = 0; index < aWords.length - 2; index += 1) {
    const current = aWords[index];

    if (
      (current === "has" || current === "have" || current === "had") &&
      aWords[index + 1] === "not" &&
      aWords[index + 2] === "been" &&
      startsWithWords(bTokens, ["it", "is"]) &&
      PASSIVE_DEFINITION_VERBS.has(bWords[2] ?? "")
    ) {
      return true;
    }
  }

  return false;
}

function sentencePairReframe(
  a: SplitSentence,
  b: SplitSentence
): NegationReframeMatch | undefined {
  const aTokens = wordTokens(a.text);
  const bTokens = wordTokens(b.text);

  if (
    !isCompleteSentence(a) ||
    !isCompleteSentence(b) ||
    !hasPairNegationSignal(aTokens)
  ) {
    return undefined;
  }

  if (
    sameSubjectCopularReframe(aTokens, bTokens) ||
    pronounCopularReframe(aTokens, bTokens) ||
    progressiveVerbMirror(aTokens, bTokens) ||
    meaningReframe(aTokens, bTokens) ||
    makeMeaningReframe(aTokens, bTokens) ||
    needReframe(aTokens, bTokens) ||
    actionVerbMirror(aTokens, bTokens) ||
    negativeSlopReframe(aTokens, bTokens) ||
    explicitContrastPivotReframe(aTokens, bTokens)
  ) {
    return {
      end: b.end,
      start: a.start,
      text: `${a.text} ${b.text}`
    };
  }

  return undefined;
}

export function findSentenceNegationReframes(
  text: string
): NegationReframeMatch[] {
  const sentences = splitSentences(text);
  const matches: NegationReframeMatch[] = [];

  for (const sentence of sentences) {
    const inlineMatch = inlineNegationContrast(sentence);

    if (inlineMatch !== undefined) {
      matches.push(inlineMatch);
    }
  }

  for (let index = 0; index < sentences.length - 1; index += 1) {
    const current = sentences[index];
    const next = sentences[index + 1];

    if (current === undefined || next === undefined) {
      continue;
    }

    const pairMatch = sentencePairReframe(current, next);

    if (pairMatch !== undefined) {
      matches.push(pairMatch);
    }
  }

  return matches;
}
