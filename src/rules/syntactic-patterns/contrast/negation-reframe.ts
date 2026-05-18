import { findNegationReframes } from "./private/negation-reframe-matcher.js";
import { oneToOneRule } from "../../private/textlint-rule-builders.js";

const rule = oneToOneRule({
  detect: (unit) =>
    findNegationReframes(unit.text).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "syntactic-patterns",
  formatMessage: (report) =>
    `Negation reframe found: "${report.evidence}". Rewrite without the not-X-then-Y construction.`,
  ruleId: "syntactic-patterns:negation-reframe",
  unitKind: "all-paragraph"
});

export default rule;
