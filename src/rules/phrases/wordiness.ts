import wordinessPatterns from "./data/wordiness-patterns.json" with { type: "json" };
import { findUnquotedPhraseMatches } from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const rule = oneToOneRule({
  detect: (unit) =>
    findUnquotedPhraseMatches(unit.text, wordinessPatterns).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "phrases",
  formatMessage: (report) =>
    `Wordy phrase found: "${report.evidence}". Replace it with direct wording.`,
  ignoredAncestorTypes: ["Link", "LinkReference"],
  ruleId: "phrases:wordiness",
  unitKind: "str"
});

export default rule;
