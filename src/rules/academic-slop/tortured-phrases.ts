import torturedPhrases from "./data/tortured-phrases.json" with { type: "json" };
import { findUnquotedPhraseMatches } from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const rule = oneToOneRule({
  detect: (unit) =>
    findUnquotedPhraseMatches(unit.text, torturedPhrases).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "academic-slop",
  formatMessage: (report) =>
    `Tortured phrase found: "${report.evidence}". Replace it with the standard scientific term.`,
  ignoredAncestorTypes: ["Link", "LinkReference"],
  ruleId: "academic-slop:tortured-phrases",
  unitKind: "str"
});

export default rule;
