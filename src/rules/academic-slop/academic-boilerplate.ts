import academicBoilerplate from "./data/academic-boilerplate.json" with { type: "json" };
import { findUnquotedPhraseMatches } from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const rule = oneToOneRule({
  detect: (unit) =>
    findUnquotedPhraseMatches(unit.text, academicBoilerplate).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "academic-slop",
  formatMessage: (report) =>
    `Academic boilerplate found: "${report.evidence}". Replace it with the concrete claim, method, or result.`,
  ignoredAncestorTypes: ["Link", "LinkReference"],
  ruleId: "academic-slop:academic-boilerplate",
  unitKind: "str"
});

export default rule;
