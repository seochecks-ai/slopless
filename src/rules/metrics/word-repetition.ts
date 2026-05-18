import { wordTokens } from "../../shared/text/tokens.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const MAX_REPETITION = 5;

const EXCLUDED_WORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "in",
  "to",
  "and",
  "of",
  "for",
  "that"
]);

function repeatedWords(
  text: string
): Array<readonly [word: string, count: number]> {
  const counts = new Map<string, number>();

  for (const token of wordTokens(text)) {
    const word = token.normalized;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts]
    .filter(([word, count]) => {
      return (
        word.length >= 4 && !EXCLUDED_WORDS.has(word) && count > MAX_REPETITION
      );
    })
    .sort(([left], [right]) => left.localeCompare(right));
}

const rule = oneToOneRule({
  detect: (unit) => {
    if (unit.text.trimStart().startsWith("<")) {
      return [];
    }

    return repeatedWords(unit.text).map(([word, count]) => ({
      data: { count },
      evidence: word,
      label: word,
      range: { start: 0, end: unit.text.length }
    }));
  },
  family: "metrics",
  formatMessage: (report) => {
    const count = report.detections[0]?.data?.["count"];
    return `Word repeated ${count} times in one paragraph: "${report.evidence}". Keep repeated words to ${MAX_REPETITION} or fewer.`;
  },
  ruleId: "metrics:word-repetition",
  unitKind: "paragraph"
});

export default rule;
