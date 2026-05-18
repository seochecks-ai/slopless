import { oneToOneRule } from "../../private/textlint-rule-builders.js";

const SUMMATIVE_PATTERNS = [
  "and that's what makes",
  "that's why this",
  "that's why it works",
  "that is why it works",
  "that's why it matters",
  "that is why it matters",
  "that's why this matters",
  "that is why this matters"
];

const rule = oneToOneRule({
  detect: (unit) => {
    const lower = unit.text.toLocaleLowerCase("en");
    const pattern = SUMMATIVE_PATTERNS.find((phrase) =>
      lower.startsWith(phrase)
    );
    if (pattern === undefined) {
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
    `Summative closer found: "${report.evidence}". End with the concrete point instead.`,
  ruleId: "syntactic-patterns:summative-closer",
  unitKind: "section-last-sentence"
});

export default rule;
