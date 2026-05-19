import { defineTextlintRule } from "../../adapters/textlint/rule.js";
import { paragraphUnits } from "../../adapters/textlint/units.js";
import type { RuleDetection, RuleId, TextUnit } from "../types.js";
import { type Token, wordTokens } from "../../shared/text/tokens.js";

const PERCEPTION_VERBS = new Set([
  "look",
  "looks",
  "looked",
  "looking",
  "watch",
  "watches",
  "watched",
  "watching",
  "stare",
  "stares",
  "stared",
  "staring",
  "gaze",
  "gazes",
  "gazed",
  "gazing",
  "glance",
  "glances",
  "glanced",
  "glancing",
  "observe",
  "observes",
  "observed",
  "observing",
  "scan",
  "scans",
  "scanned",
  "scanning",
  "peer",
  "peers",
  "peered",
  "peering",
  "squint",
  "squints",
  "squinted",
  "squinting",
  "study",
  "studies",
  "studied",
  "studying",
  "notice",
  "notices",
  "noticed",
  "noticing",
  "see",
  "sees",
  "saw",
  "seeing"
]);

const PURPOSE_LOOK_PARTICLES = new Set(["for", "up", "under", "into"]);
const MAX_PARAGRAPH_TOKENS = 80;
const MAX_WINDOW_TOKENS = 45;
const MIN_PARAGRAPH_HITS = 3;
const MIN_WINDOW_HITS = 2;
const WINDOW_SENTENCES = 3;
const GROUP = "perception verb";
const RULE_ID = "narrative-slop:perception-verb-density" satisfies RuleId;

type PerceptionGroup = typeof GROUP;

function isPurposeLook(tokens: readonly Token[], index: number): boolean {
  const token = tokens[index];
  const next = tokens[index + 1];

  return (
    token !== undefined &&
    token.normalized.startsWith("look") &&
    next !== undefined &&
    PURPOSE_LOOK_PARTICLES.has(next.normalized)
  );
}

function perceptionDetections(
  unit: TextUnit
): RuleDetection<PerceptionGroup>[] {
  const tokens = wordTokens(unit.text);
  return tokens
    .filter((token, index) => {
      return (
        PERCEPTION_VERBS.has(token.normalized) && !isPurposeLook(tokens, index)
      );
    })
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
    detect: ({ units }) => units.flatMap((unit) => perceptionDetections(unit)),
    family: "narrative-slop",
    id: RULE_ID
  },
  formatMessage: (report) => {
    const labels = [...new Set(report.detections.map((hit) => hit.label))];
    return `Perception verb density: ${report.detections.length} perception verbs in a short span (${labels.join(", ")}).`;
  },
  reportPolicy: {
    groups: [GROUP],
    kind: "density",
    maxParagraphTokens: MAX_PARAGRAPH_TOKENS,
    maxWindowTokens: MAX_WINDOW_TOKENS,
    paragraphMinimumHits: MIN_PARAGRAPH_HITS,
    windowMinimumHits: MIN_WINDOW_HITS,
    windowSentences: WINDOW_SENTENCES
  },
  units: (document) => paragraphUnits(document)
});

export default rule;
