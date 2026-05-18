import {
  findUnquotedTokenTemplateMatches,
  type TokenTemplatePattern
} from "../../shared/matchers/phrases.js";
import { wordTokens } from "../../shared/text/tokens.js";
import narrativeClichePatterns from "./data/narrative-cliches.json" with { type: "json" };
import { oneToOneRule } from "../private/textlint-rule-builders.js";

type NarrativeClichePattern = TokenTemplatePattern & {
  readonly category: string;
  readonly purpose: string;
};

const NARRATIVE_CLICHE_PATTERNS =
  narrativeClichePatterns as readonly NarrativeClichePattern[];

const PATTERNS_BY_ID = new Map(
  NARRATIVE_CLICHE_PATTERNS.map((pattern) => [pattern.id, pattern])
);
const CONCRETE_CAUSE_MARKERS = [" because ", " since "];

function hasConcreteCause(sentence: string): boolean {
  const normalized = ` ${sentence.toLocaleLowerCase("en")} `;
  return CONCRETE_CAUSE_MARKERS.some((marker) => normalized.includes(marker));
}

const rule = oneToOneRule({
  detect: (unit) => {
    if (wordTokens(unit.text).length > 80 || hasConcreteCause(unit.text)) {
      return [];
    }

    const match = findUnquotedTokenTemplateMatches(
      unit.text,
      NARRATIVE_CLICHE_PATTERNS
    )[0];
    if (match === undefined) {
      return [];
    }

    const pattern = PATTERNS_BY_ID.get(match.patternId);
    if (pattern === undefined) {
      return [];
    }

    return [
      {
        data: {
          category: pattern.category,
          patternId: match.patternId,
          purpose: pattern.purpose,
          template: match.template
        },
        evidence: match.text,
        label: match.patternId,
        range: { start: match.start, end: match.end }
      }
    ];
  },
  family: "narrative-slop",
  formatMessage: (report) => {
    const data = report.detections[0]?.data;
    return `Narrative cliche (${data?.["category"]}/${data?.["patternId"]}): ${data?.["purpose"]} Matched template: ${data?.["template"]}`;
  },
  ruleId: "narrative-slop:narrative-cliches",
  unitKind: "sentence"
});

export default rule;
