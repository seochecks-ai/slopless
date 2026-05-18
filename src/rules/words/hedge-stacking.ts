import { wordTokens } from "../../shared/text/tokens.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const HEDGE_THRESHOLD = 2;

const HEDGE_WORDS = new Set([
  "might",
  "maybe",
  "perhaps",
  "possibly",
  "likely",
  "probably",
  "seems",
  "apparently"
]);

function hedgeCount(text: string): number {
  let count = 0;

  for (const token of wordTokens(text)) {
    if (HEDGE_WORDS.has(token.normalized)) {
      count += 1;
    }
  }

  return count;
}

const rule = oneToOneRule({
  detect: (unit) => {
    const count = hedgeCount(unit.text);
    if (count < HEDGE_THRESHOLD) {
      return [];
    }

    return [
      {
        evidence: String(count),
        label: "hedge stacking",
        range: { start: 0, end: unit.text.length }
      }
    ];
  },
  family: "words",
  formatMessage: (report) =>
    `Hedge stacking found: ${report.evidence} hedge words in one sentence. Keep fewer than ${HEDGE_THRESHOLD}.`,
  ruleId: "words:hedge-stacking",
  unitKind: "sentence"
});

export default rule;
