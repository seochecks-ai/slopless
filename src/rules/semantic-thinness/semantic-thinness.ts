import { semanticThinnessPatterns } from "./private/pattern-data.js";
import {
  compileSemanticThinnessPatterns,
  findSemanticThinnessMatch
} from "./private/pattern-matcher.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const COMPILED_PATTERNS = compileSemanticThinnessPatterns(
  semanticThinnessPatterns
);

const rule = oneToOneRule({
  detect: (unit) => {
    const match = findSemanticThinnessMatch(unit.text, COMPILED_PATTERNS);
    if (match === undefined) {
      return [];
    }

    return [
      {
        data: {
          patternId: match.patternId,
          purpose: match.purpose,
          signal: match.signal
        },
        evidence: unit.text,
        label: match.patternId,
        range: { start: 0, end: unit.text.length }
      }
    ];
  },
  family: "semantic-thinness",
  formatMessage: (report) => {
    const data = report.detections[0]?.data;
    return `Semantic thinness (${data?.["patternId"]}): ${data?.["purpose"]} Matched template: ${data?.["signal"]}`;
  },
  ruleId: "semantic-thinness:semantic-thinness",
  unitKind: "sentence"
});

export default rule;
