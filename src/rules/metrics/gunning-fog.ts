import { TextReadability } from "@lunarisapp/readability";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const MAX_SCORE = 12;

function rounded(score: number): number {
  return Math.round(score * 100) / 100;
}

const rule = oneToOneRule({
  detect: (unit) => {
    if (unit.text.length === 0) {
      return [];
    }

    const readability = new TextReadability({ lang: "en_US" });
    const score = readability.gunningFog(unit.text);
    if (score <= MAX_SCORE) {
      return [];
    }

    return [
      {
        evidence: String(rounded(score)),
        label: "Gunning Fog",
        range: { start: 0, end: 0 }
      }
    ];
  },
  family: "metrics",
  formatMessage: (report) =>
    `Gunning Fog is ${report.evidence}. Keep it at ${MAX_SCORE} or lower.`,
  ruleId: "metrics:gunning-fog",
  unitKind: "document"
});

export default rule;
