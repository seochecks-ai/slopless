import skunkedTerms from "./data/skunked-terms.json" with { type: "json" };
import { findUnquotedPhraseMatches } from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const rule = oneToOneRule({
  detect: (unit) =>
    findUnquotedPhraseMatches(unit.text, skunkedTerms).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "phrases",
  formatMessage: (report) =>
    `Skunked term found: "${report.evidence}". Replace it with a less disputed word.`,
  ignoredAncestorTypes: ["Link", "LinkReference"],
  ruleId: "phrases:skunked-terms",
  unitKind: "str"
});

export default rule;
