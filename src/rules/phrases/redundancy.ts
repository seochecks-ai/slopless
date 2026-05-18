import redundancyPatterns from "./data/redundancy-patterns.json" with { type: "json" };
import { findUnquotedPhraseMatches } from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const rule = oneToOneRule({
  detect: (unit) =>
    findUnquotedPhraseMatches(unit.text, redundancyPatterns).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "phrases",
  formatMessage: (report) =>
    `Redundant phrase found: "${report.evidence}". Remove the repeated meaning.`,
  ignoredAncestorTypes: ["Link", "LinkReference"],
  ruleId: "phrases:redundancy",
  unitKind: "str"
});

export default rule;
