import { oneToOneRule } from "../../private/textlint-rule-builders.js";

const FALSE_QUESTION_PATTERNS = [
  "isn't that what we all",
  "isn't that the point",
  "isn't that the goal",
  "isn't that what matters",
  "isn't that why"
];

const rule = oneToOneRule({
  detect: (unit) => {
    const lower = unit.text.toLocaleLowerCase("en");
    const pattern = FALSE_QUESTION_PATTERNS.find((phrase) =>
      lower.includes(phrase)
    );
    if (pattern === undefined || !unit.text.endsWith("?")) {
      return [];
    }

    return [
      {
        evidence: pattern,
        label: pattern,
        range: { start: 0, end: unit.text.length }
      }
    ];
  },
  family: "syntactic-patterns",
  formatMessage: (report) =>
    `False question found: "${report.evidence}". Make the claim directly.`,
  ruleId: "syntactic-patterns:false-question",
  unitKind: "section-last-sentence"
});

export default rule;
