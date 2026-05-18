import { oneToOneRule } from "../../private/textlint-rule-builders.js";

const OPENERS = [
  "the interesting part is",
  "in the ever-evolving landscape",
  "in the realm of",
  "in the world of",
  "in today's digital age",
  "in today's fast-paced world"
];

const rule = oneToOneRule({
  detect: (unit) => {
    const lower = unit.text.toLocaleLowerCase("en");
    const opener = OPENERS.find((phrase) => lower.startsWith(phrase));
    if (opener === undefined) {
      return [];
    }

    return [
      {
        evidence: opener,
        label: opener,
        range: { start: 0, end: unit.text.length }
      }
    ];
  },
  family: "syntactic-patterns",
  formatMessage: (report) =>
    `LLM opener found: "${report.evidence}". Start with the concrete claim instead.`,
  ruleId: "syntactic-patterns:llm-openers",
  unitKind: "section-first-sentence"
});

export default rule;
