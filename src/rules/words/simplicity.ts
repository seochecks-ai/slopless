import simplicityPairs from "./data/simplicity-pairs.json" with { type: "json" };
import { wordTokens } from "../../shared/text/tokens.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const SIMPLE_BY_COMPLEX = new Map(
  simplicityPairs.map(([complex, simple]) => [complex, simple])
);

const rule = oneToOneRule({
  detect: (unit) =>
    wordTokens(unit.text).flatMap((token) => {
      const simple = SIMPLE_BY_COMPLEX.get(token.normalized);
      if (simple === undefined) {
        return [];
      }

      return [
        {
          data: { simple },
          evidence: token.text,
          label: token.text,
          range: { start: token.start, end: token.end }
        }
      ];
    }),
  family: "words",
  formatMessage: (report) =>
    `Complex word found: "${report.evidence}". Use "${report.detections[0]?.data?.["simple"]}" instead.`,
  ruleId: "words:simplicity",
  unitKind: "sentence"
});

export default rule;
