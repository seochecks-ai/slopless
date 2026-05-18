import prohibitedWords from "./data/prohibited-words.json" with { type: "json" };
import { findPhraseMatches } from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const rule = oneToOneRule({
  detect: (unit) =>
    findPhraseMatches(unit.text, prohibitedWords).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "words",
  formatMessage: (report) =>
    `Prohibited word found: "${report.evidence}". Rewrite without this term.`,
  ruleId: "words:prohibited-words",
  unitKind: "str"
});

export default rule;
