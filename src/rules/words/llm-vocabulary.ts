import { findVocabularyMatches } from "./private/vocabulary-context.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const LLM_VOCABULARY = new Set([
  "delve",
  "vibrant",
  "landscape",
  "realm",
  "embark",
  "excels",
  "vital",
  "comprehensive",
  "intricate",
  "pivotal",
  "moreover",
  "tapestry"
]);

const rule = oneToOneRule({
  detect: (unit) =>
    findVocabularyMatches(unit.text, [...LLM_VOCABULARY]).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "words",
  formatMessage: (report) =>
    `LLM vocabulary found: "${report.evidence}". Replace the stock diction with a concrete word.`,
  ruleId: "words:llm-vocabulary",
  unitKind: "str"
});

export default rule;
