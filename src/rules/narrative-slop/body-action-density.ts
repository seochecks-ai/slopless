import { defineTextlintRule } from "../../adapters/textlint/rule.js";
import { paragraphUnits } from "../../adapters/textlint/units.js";
import type { RuleDetection, RuleId, TextUnit } from "../types.js";
import { type Token, wordTokens } from "../../shared/text/tokens.js";

const MOVEMENT_CUES = new Set([
  "step",
  "steps",
  "stepped",
  "stepping",
  "walk",
  "walks",
  "walked",
  "walking",
  "stand",
  "stands",
  "stood",
  "standing",
  "sit",
  "sits",
  "sat",
  "sitting",
  "turn",
  "turns",
  "turned",
  "turning",
  "cross",
  "crosses",
  "crossed",
  "crossing",
  "climb",
  "climbs",
  "climbed",
  "climbing",
  "crouch",
  "crouches",
  "crouched",
  "crouching",
  "stop",
  "stops",
  "stopped",
  "stopping",
  "wait",
  "waits",
  "waited",
  "waiting",
  "pull",
  "pulls",
  "pulled",
  "pulling",
  "lean",
  "leans",
  "leaned",
  "leaning",
  "pause",
  "pauses",
  "paused",
  "pausing",
  "swallow",
  "swallows",
  "swallowed",
  "swallowing",
  "pick",
  "picks",
  "picked",
  "picking",
  "flatten",
  "flattens",
  "flattened",
  "flattening",
  "flick",
  "flicks",
  "flicked",
  "flicking"
]);

const BODY_CUES = new Set([
  "ear",
  "ears",
  "tail",
  "tails",
  "chest",
  "chests",
  "stomach",
  "stomachs",
  "heart",
  "hearts",
  "breath",
  "breaths",
  "paw",
  "paws",
  "hand",
  "hands",
  "shoulder",
  "shoulders",
  "jaw",
  "jaws",
  "throat",
  "throats",
  "pulse",
  "pulses",
  "spine",
  "spines",
  "skin",
  "neck",
  "necks",
  "blink",
  "blinks",
  "blinked",
  "blinking"
]);

const MAX_PARAGRAPH_TOKENS = 95;
const MAX_WINDOW_TOKENS = 60;
const MIN_GROUP_HITS = 3;
const WINDOW_SENTENCES = 4;
const RULE_ID = "narrative-slop:body-action-density" satisfies RuleId;

type CueGroup = "body cue" | "movement cue";
type PhraseCue = {
  readonly group: CueGroup;
  readonly tokens: readonly string[];
};

const PHRASE_CUES: readonly PhraseCue[] = [
  { group: "movement cue", tokens: ["crossed", "her", "arms"] },
  { group: "movement cue", tokens: ["crossed", "his", "arms"] },
  { group: "movement cue", tokens: ["crossed", "their", "arms"] },
  { group: "movement cue", tokens: ["turned", "her", "head"] },
  { group: "movement cue", tokens: ["turned", "his", "head"] },
  { group: "movement cue", tokens: ["turned", "their", "head"] },
  { group: "movement cue", tokens: ["sat", "up"] },
  { group: "movement cue", tokens: ["walked", "over"] },
  { group: "movement cue", tokens: ["stopped", "next", "to"] },
  { group: "movement cue", tokens: ["looked", "up", "at"] },
  { group: "movement cue", tokens: ["rested", "her", "paws"] },
  { group: "movement cue", tokens: ["rested", "his", "paws"] },
  { group: "movement cue", tokens: ["rested", "their", "paws"] },
  { group: "movement cue", tokens: ["rested", "her", "hands"] },
  { group: "movement cue", tokens: ["rested", "his", "hands"] },
  { group: "movement cue", tokens: ["rested", "their", "hands"] },
  { group: "body cue", tokens: ["could", "not", "help", "but", "feel"] },
  { group: "body cue", tokens: ["couldn't", "help", "but", "feel"] },
  { group: "body cue", tokens: ["could", "not", "shake", "the", "feeling"] },
  { group: "body cue", tokens: ["couldn't", "shake", "the", "feeling"] },
  { group: "body cue", tokens: ["eyes", "never", "leaving"] },
  { group: "body cue", tokens: ["felt", "a", "surge"] },
  { group: "body cue", tokens: ["felt", "a", "profound", "sense"] },
  { group: "body cue", tokens: ["ghost", "of", "a", "smile"] },
  { group: "body cue", tokens: ["mischievous", "glint"] },
  { group: "body cue", tokens: ["dangerous", "glint"] },
  { group: "body cue", tokens: ["took", "a", "deep", "breath"] },
  { group: "body cue", tokens: ["let", "out", "a", "breath"] },
  {
    group: "body cue",
    tokens: ["breath", "she", "didn't", "know", "she", "was", "holding"]
  },
  {
    group: "body cue",
    tokens: ["breath", "he", "didn't", "know", "he", "was", "holding"]
  },
  {
    group: "body cue",
    tokens: ["breath", "they", "didn't", "know", "they", "were", "holding"]
  },
  { group: "body cue", tokens: ["voice", "was", "low"] },
  { group: "body cue", tokens: ["lowered", "her", "voice"] },
  { group: "body cue", tokens: ["lowered", "his", "voice"] },
  { group: "body cue", tokens: ["lowered", "their", "voice"] },
  { group: "body cue", tokens: ["smile", "played", "on", "her", "lips"] },
  { group: "body cue", tokens: ["smile", "played", "on", "his", "lips"] },
  { group: "body cue", tokens: ["smile", "played", "on", "their", "lips"] },
  { group: "body cue", tokens: ["smile", "spread", "across", "her", "face"] },
  { group: "body cue", tokens: ["smile", "spread", "across", "his", "face"] },
  { group: "body cue", tokens: ["smile", "spread", "across", "their", "face"] },
  {
    group: "body cue",
    tokens: ["smile", "spreading", "across", "her", "face"]
  },
  {
    group: "body cue",
    tokens: ["smile", "spreading", "across", "his", "face"]
  },
  {
    group: "body cue",
    tokens: ["smile", "spreading", "across", "their", "face"]
  },
  { group: "body cue", tokens: ["looked", "tired"] },
  { group: "body cue", tokens: ["jaw", "tightened"] },
  { group: "body cue", tokens: ["shoulders", "stiffened"] },
  { group: "body cue", tokens: ["ears", "twitched"] },
  { group: "body cue", tokens: ["ears", "flattened"] },
  { group: "body cue", tokens: ["tail", "hung", "still"] },
  { group: "body cue", tokens: ["tail", "angled"] },
  { group: "body cue", tokens: ["tail", "flicked"] },
  { group: "body cue", tokens: ["paws", "shifted"] },
  { group: "body cue", tokens: ["paws", "trembled"] }
];

function markCovered(
  covered: Set<number>,
  start: number,
  length: number
): void {
  for (let offset = 0; offset < length; offset += 1) {
    covered.add(start + offset);
  }
}

function cueGroup(token: Token): CueGroup | undefined {
  if (MOVEMENT_CUES.has(token.normalized)) {
    return "movement cue";
  }

  if (BODY_CUES.has(token.normalized)) {
    return "body cue";
  }

  return undefined;
}

function tokensMatchAt(
  tokens: readonly Token[],
  expected: readonly string[],
  start: number
): boolean {
  if (start + expected.length > tokens.length) {
    return false;
  }

  return expected.every(
    (word, index) => tokens[start + index]?.normalized === word
  );
}

function cueDetections(unit: TextUnit): RuleDetection<CueGroup>[] {
  const tokens = wordTokens(unit.text);
  const detections: RuleDetection<CueGroup>[] = [];
  const phraseCovered = new Set<number>();

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === undefined) {
      continue;
    }

    for (const phrase of PHRASE_CUES) {
      if (!tokensMatchAt(tokens, phrase.tokens, index)) {
        continue;
      }

      const last = tokens[index + phrase.tokens.length - 1];
      if (last === undefined) {
        continue;
      }

      detections.push({
        evidence: unit.text.slice(token.start, last.end),
        group: phrase.group,
        label: phrase.tokens.join(" "),
        range: { end: last.end, start: token.start },
        ruleId: RULE_ID,
        unitId: unit.id
      });
      markCovered(phraseCovered, index, phrase.tokens.length);
    }
  }

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === undefined || phraseCovered.has(index)) {
      continue;
    }

    const group = cueGroup(token);
    if (group !== undefined) {
      detections.push({
        evidence: unit.text.slice(token.start, token.end),
        group,
        label: token.normalized,
        range: { end: token.end, start: token.start },
        ruleId: RULE_ID,
        unitId: unit.id
      });
    }
  }

  return detections.sort((left, right) => left.range.start - right.range.start);
}

const rule = defineTextlintRule({
  detector: {
    detect: ({ units }) => units.flatMap((unit) => cueDetections(unit)),
    family: "narrative-slop",
    id: RULE_ID
  },
  formatMessage: (report) => {
    const first = report.detections[0];
    const labels = [...new Set(report.detections.map((hit) => hit.label))];
    return `Body-action density: ${report.detections.length} ${first?.group}s in a short span (${labels.join(", ")}).`;
  },
  reportPolicy: {
    groups: ["movement cue", "body cue"],
    kind: "density",
    maxParagraphTokens: MAX_PARAGRAPH_TOKENS,
    maxWindowTokens: MAX_WINDOW_TOKENS,
    paragraphMinimumHits: MIN_GROUP_HITS,
    windowMinimumHits: MIN_GROUP_HITS,
    windowSentences: WINDOW_SENTENCES
  },
  units: (document) => paragraphUnits(document)
});

export default rule;
