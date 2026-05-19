import {
  cleanSentence,
  tokens
} from "../../../../shared/matchers/prose-patterns.js";

const PREFIXES = ["and ", "but ", "so ", "because "];
const CONTRAST_FRAME_NOUNS = [
  "answer",
  "choice",
  "fix",
  "focus",
  "move",
  "plan",
  "point",
  "problem",
  "strategy",
  "work"
];
const DETERMINERS = ["a", "an", "the", "this", "that"];

function hasAny(words: readonly string[], values: readonly string[]): boolean {
  return words.some((word) => values.includes(word));
}

export function matchSameSentenceContrast(
  sentence: string
): string | undefined {
  const words = tokens(cleanSentence(sentence, PREFIXES));
  const notIndex = words.indexOf("not");
  const butIndex = words.indexOf("but");
  const thanIndex = words.indexOf("than");

  if (
    words.length <= 14 &&
    notIndex >= 0 &&
    butIndex > notIndex &&
    hasAny(words.slice(0, Math.min(notIndex, 5)), CONTRAST_FRAME_NOUNS) &&
    !DETERMINERS.includes(words[butIndex + 1] ?? "")
  ) {
    return "not-x-but-y";
  }

  if (
    words.length <= 10 &&
    words[2] === "is" &&
    words[3] === "less" &&
    words[4] === "about" &&
    thanIndex > 4
  ) {
    return "less-about-than";
  }

  if (
    words.length <= 10 &&
    words[2] === "is" &&
    words[3] === "more" &&
    words[4] === "about" &&
    thanIndex > 4
  ) {
    return "more-about-than";
  }

  return undefined;
}
