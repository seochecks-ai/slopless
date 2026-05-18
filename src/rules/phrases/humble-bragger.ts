import { findPhraseMatches } from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const HUMBLE_BRAGGER_PHRASES = [
  "in my experience",
  "as someone who has",
  "having worked with"
];

const rule = oneToOneRule({
  detect: (unit) =>
    findPhraseMatches(unit.text, HUMBLE_BRAGGER_PHRASES).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "phrases",
  formatMessage: (report) =>
    `Humble-bragging phrase found: "${report.evidence}". Remove the credentialing lead-in.`,
  ruleId: "phrases:humble-bragger",
  unitKind: "sentence"
});

export default rule;
