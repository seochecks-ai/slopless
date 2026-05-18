import prohibitedPhrases from "./data/prohibited-phrases.json" with { type: "json" };
import { findUnquotedPhraseMatches } from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const rule = oneToOneRule({
  detect: (unit) =>
    findUnquotedPhraseMatches(unit.text, prohibitedPhrases).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "phrases",
  formatMessage: (report) =>
    `Prohibited phrase found: "${report.evidence}". Rewrite without this phrase.`,
  ignoredAncestorTypes: ["Link", "LinkReference"],
  ruleId: "phrases:prohibited-phrases",
  unitKind: "str"
});

export default rule;
