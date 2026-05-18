import { wordTokens } from "../../shared/text/tokens.js";
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
    wordTokens(unit.text)
      .filter((token) => LLM_VOCABULARY.has(token.normalized))
      .map((token) => ({
        evidence: token.text,
        label: token.text,
        range: { start: token.start, end: token.end }
      })),
  family: "words",
  formatMessage: (report) =>
    `LLM vocabulary found: "${report.evidence}". Replace the stock diction with a concrete word.`,
  ruleId: "words:llm-vocabulary",
  unitKind: "str"
});

export default rule;
