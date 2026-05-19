import { defineTextlintRule } from "../../adapters/textlint/rule.js";
import { paragraphUnits } from "../../adapters/textlint/units.js";
import { wordTokens } from "../../shared/text/tokens.js";
import { isVocabularyContextAllowed } from "./private/vocabulary-context.js";
import type { RuleDetection, RuleId, TextUnit } from "../types.js";

const RULE_ID = "words:llm-vocabulary-density" satisfies RuleId;
const GROUP = "llm vocabulary";
const MAX_PARAGRAPH_TOKENS = 90;
const MAX_WINDOW_TOKENS = 65;
const MIN_HITS = 4;
const WINDOW_SENTENCES = 4;

const LLM_DENSITY_WORDS = new Set([
  "approach",
  "approaches",
  "ecosystem",
  "ecosystems",
  "elevate",
  "elevates",
  "elevating",
  "elevated",
  "impact",
  "impacts",
  "insight",
  "insights",
  "nuance",
  "nuanced",
  "robust",
  "scale",
  "scales",
  "scalable",
  "seamless",
  "strategy",
  "strategies",
  "strategic",
  "touchpoint",
  "touchpoints",
  "transform",
  "transformation",
  "transformative",
  "unlock",
  "unlocks",
  "unlocking",
  "workflow",
  "workflows"
]);

type VocabularyGroup = typeof GROUP;

function vocabularyDetections(
  unit: TextUnit
): RuleDetection<VocabularyGroup>[] {
  return wordTokens(unit.text)
    .filter(
      (token) =>
        LLM_DENSITY_WORDS.has(token.normalized) &&
        !isVocabularyContextAllowed(unit.text, token.normalized)
    )
    .map((token) => ({
      evidence: unit.text.slice(token.start, token.end),
      group: GROUP,
      label: token.normalized,
      range: { end: token.end, start: token.start },
      ruleId: RULE_ID,
      unitId: unit.id
    }));
}

const rule = defineTextlintRule({
  detector: {
    detect: ({ units }) => units.flatMap((unit) => vocabularyDetections(unit)),
    family: "words",
    id: RULE_ID
  },
  formatMessage: (report) => {
    const labels = [...new Set(report.detections.map((hit) => hit.label))];
    return `LLM vocabulary density: ${report.detections.length} stock abstraction words in a short span (${labels.join(", ")}).`;
  },
  reportPolicy: {
    groups: [GROUP],
    kind: "density",
    maxParagraphTokens: MAX_PARAGRAPH_TOKENS,
    maxWindowTokens: MAX_WINDOW_TOKENS,
    paragraphMinimumHits: MIN_HITS,
    windowMinimumHits: MIN_HITS,
    windowSentences: WINDOW_SENTENCES
  },
  units: (document) => paragraphUnits(document)
});

export default rule;
