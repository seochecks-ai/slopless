import type { SplitSentence } from "../../../../shared/text/sentences.js";
import type { Token } from "../../../../shared/text/tokens.js";

export const NEGATION_WORDS = new Set([
  "not",
  "isn't",
  "aren't",
  "wasn't",
  "weren't",
  "don't",
  "doesn't",
  "didn't",
  "can't",
  "cannot",
  "won't",
  "wouldn't",
  "shouldn't",
  "couldn't"
]);

export const COPULAR_FORMS = new Map<string, string>([
  ["are", "are"],
  ["aren't", "are"],
  ["is", "is"],
  ["isn't", "is"],
  ["was", "was"],
  ["wasn't", "was"],
  ["were", "were"],
  ["weren't", "were"]
]);

export const DO_NEGATIONS = new Set(["don't", "doesn't", "didn't"]);
export const EXPLICIT_DO_AUXILIARIES = new Set(["do", "does", "did"]);
export const OPTIONAL_ADVERBS = new Set([
  "actually",
  "automatically",
  "just",
  "necessarily",
  "really",
  "usually"
]);
export const FACTUAL_NEGATION_CONNECTORS = new Set([
  "because",
  "if",
  "since",
  "until",
  "when",
  "while"
]);
export const PRONOUN_REFRAME_STARTS = [
  ["it", "is"],
  ["it", "was"],
  ["this", "is"],
  ["that", "is"],
  ["they", "are"],
  ["they", "were"],
  ["you", "are"],
  ["we", "are"]
] as const;
export const PASSIVE_DEFINITION_VERBS = new Set([
  "associated",
  "caused",
  "classified",
  "defined",
  "described",
  "linked",
  "marked",
  "produced"
]);
const IRREGULAR_PAST_TENSE = new Map<string, string>([["go", "went"]]);

export type CopularNegation = {
  readonly affirmativeAux: string;
  readonly negatedPredicateStart: number;
  readonly subject: readonly string[];
};

export function findNegationIndex(
  tokens: readonly Token[]
): number | undefined {
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (token !== undefined && NEGATION_WORDS.has(token.normalized)) {
      return index;
    }
  }

  return undefined;
}

export function startsWithWords(
  tokens: readonly Token[],
  words: readonly string[]
): boolean {
  if (words.length === 0 || tokens.length < words.length) {
    return false;
  }

  for (let index = 0; index < words.length; index += 1) {
    if (tokens[index]?.normalized !== words[index]) {
      return false;
    }
  }

  return true;
}

function regularPastTense(verb: string): string {
  return verb.endsWith("e") ? `${verb}d` : `${verb}ed`;
}

function affirmativeVerbForms(verb: string): readonly string[] {
  return [verb, IRREGULAR_PAST_TENSE.get(verb) ?? regularPastTense(verb)];
}

export function stripLeadingPairPivot(
  tokens: readonly Token[]
): readonly Token[] {
  return tokens[0]?.normalized === "instead" ? tokens.slice(1) : tokens;
}

export function startsWithSubjectOrPronoun(
  tokens: readonly Token[],
  subject: readonly string[]
): boolean {
  if (startsWithWords(tokens, subject)) {
    return true;
  }

  if (subject.length === 1) {
    return false;
  }

  return startsWithWords(tokens, ["they"]) || startsWithWords(tokens, ["it"]);
}

export function startsWithSubjectVerb(
  tokens: readonly Token[],
  subject: readonly string[],
  verb: string
): boolean {
  return affirmativeVerbForms(verb).some((candidate) =>
    startsWithWords(tokens, [...subject, candidate])
  );
}

export function words(tokens: readonly Token[]): readonly string[] {
  return tokens.map((token) => token.normalized);
}

export function hasAnyWord(
  tokens: readonly string[],
  candidates: ReadonlySet<string>
): boolean {
  return tokens.some((token) => candidates.has(token));
}

export function skipOptionalAdverbs(
  tokens: readonly string[],
  start: number
): number {
  let index = start;

  while (OPTIONAL_ADVERBS.has(tokens[index] ?? "")) {
    index += 1;
  }

  return index;
}

export function startsWithAny(
  tokens: readonly Token[],
  starts: readonly (readonly string[])[]
): boolean {
  return starts.some((start) => startsWithWords(tokens, start));
}

export function isCompleteSentence(sentence: SplitSentence): boolean {
  const trimmed = sentence.text.trim();
  const last = trimmed.at(-1);

  return last === "." || last === "!" || last === "?";
}

export function hasCommaBeforeNegation(
  text: string,
  negationStart: number
): boolean {
  for (let index = negationStart - 1; index >= 0; index -= 1) {
    const char = text[index];

    if (char === ",") {
      return true;
    }

    if (char !== undefined && char.trim() !== "") {
      return false;
    }
  }

  return false;
}

export function findCopularNegation(
  tokens: readonly Token[]
): CopularNegation | undefined {
  const tokenWords = words(tokens);

  for (let index = 0; index < tokenWords.length; index += 1) {
    const current = tokenWords[index];
    const next = tokenWords[index + 1];
    const explicitAux =
      current === undefined ? undefined : COPULAR_FORMS.get(current);

    if (
      explicitAux !== undefined &&
      current !== undefined &&
      current !== next &&
      current.endsWith("n't")
    ) {
      return {
        affirmativeAux: explicitAux,
        negatedPredicateStart: index + 1,
        subject: tokenWords.slice(0, index)
      };
    }

    if (explicitAux !== undefined && next === "not") {
      return {
        affirmativeAux: explicitAux,
        negatedPredicateStart: index + 2,
        subject: tokenWords.slice(0, index)
      };
    }
  }

  return undefined;
}

export function validSubject(subject: readonly string[]): boolean {
  return subject.length > 0 && subject.length <= 8;
}

export function contrastPivotSubject(
  tokens: readonly Token[]
): readonly string[] | undefined {
  const tokenWords = words(tokens);

  for (let index = 0; index < tokenWords.length; index += 1) {
    const current = tokenWords[index];

    if (current === undefined || COPULAR_FORMS.get(current) === undefined) {
      continue;
    }

    const subject = tokenWords.slice(0, index);

    if (!validSubject(subject)) {
      continue;
    }

    if (tokenWords[index + 1] === "not" && tokenWords[index + 2] === "just") {
      return subject;
    }

    if (
      tokenWords[index + 1] === "no" &&
      tokenWords[index + 2] === "longer" &&
      tokenWords[index + 3] === "just"
    ) {
      return subject;
    }
  }

  return undefined;
}
