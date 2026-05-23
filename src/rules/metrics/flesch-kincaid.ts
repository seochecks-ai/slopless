import readability from "text-readability";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const MIN_SCORE = 61;

function rounded(score: number): number {
  return Math.round(score * 100) / 100;
}

const rule = oneToOneRule({
  detect: (unit) => {
    if (unit.text.length === 0) {
      return [];
    }

    const score = readability.fleschReadingEase(unit.text);
    if (score >= MIN_SCORE) {
      return [];
    }

    return [
      {
        evidence: String(rounded(score)),
        label: "Flesch Reading Ease",
        range: { start: 0, end: 0 }
      }
    ];
  },
  family: "metrics",
  formatMessage: (report) =>
    `Flesch Reading Ease is ${report.evidence}. Keep it at ${MIN_SCORE} or higher.`,
  ruleId: "metrics:flesch-kincaid",
  unitKind: "document"
});

export default rule;
