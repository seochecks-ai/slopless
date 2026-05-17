import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { allParagraphs } from "../../shared/text/sections.js";
import { splitSentences } from "../../shared/text/sentences.js";
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
  "pick",
  "picks",
  "picked",
  "picking"
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
  "paws"
]);

const MAX_PARAGRAPH_TOKENS = 95;
const MAX_WINDOW_TOKENS = 60;
const MIN_GROUP_HITS = 3;
const WINDOW_SENTENCES = 4;

type CueGroup = "body cue" | "movement cue";

type DenseMatch = {
  readonly count: number;
  readonly end: number;
  readonly group: CueGroup;
  readonly start: number;
  readonly words: readonly string[];
};

function cueGroup(token: Token): CueGroup | undefined {
  if (MOVEMENT_CUES.has(token.normalized)) {
    return "movement cue";
  }

  if (BODY_CUES.has(token.normalized)) {
    return "body cue";
  }

  return undefined;
}

function denseMatchForSpan(
  text: string,
  start: number,
  end: number
): DenseMatch | undefined {
  const byGroup = new Map<CueGroup, Token[]>();

  for (const token of wordTokens(text.slice(start, end))) {
    const group = cueGroup(token);
    if (group === undefined) {
      continue;
    }

    byGroup.set(group, [...(byGroup.get(group) ?? []), token]);
  }

  for (const group of ["movement cue", "body cue"] as const) {
    const hits = byGroup.get(group) ?? [];
    if (hits.length < MIN_GROUP_HITS) {
      continue;
    }

    const first = hits[0];
    const last = hits.at(-1);
    if (first === undefined || last === undefined) {
      continue;
    }

    return {
      count: hits.length,
      end: start + last.end,
      group,
      start: start + first.start,
      words: [...new Set(hits.map((token) => token.normalized))]
    };
  }

  return undefined;
}

function firstDenseMatch(text: string): DenseMatch | undefined {
  if (wordTokens(text).length <= MAX_PARAGRAPH_TOKENS) {
    const paragraphMatch = denseMatchForSpan(text, 0, text.length);
    if (paragraphMatch !== undefined) {
      return paragraphMatch;
    }
  }

  const sentences = splitSentences(text);
  for (let index = 0; index < sentences.length; index += 1) {
    const window = sentences.slice(index, index + WINDOW_SENTENCES);
    if (window.length < 2) {
      continue;
    }

    const first = window[0];
    const last = window.at(-1);
    if (first === undefined || last === undefined) {
      continue;
    }

    if (
      wordTokens(text.slice(first.start, last.end)).length > MAX_WINDOW_TOKENS
    ) {
      continue;
    }

    const windowMatch = denseMatchForSpan(text, first.start, last.end);
    if (windowMatch !== undefined) {
      return windowMatch;
    }
  }

  return undefined;
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax, RuleError, locator, report } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphs(node)) {
        const match = firstDenseMatch(item.text);
        if (match === undefined) {
          continue;
        }

        report(
          item.paragraph,
          new RuleError(
            `Body-action density: ${match.count} ${match.group}s in a short span (${match.words.join(", ")}).`,
            {
              padding: locator.range([
                item.source.originalStartFor(match.start),
                item.source.originalEndFor(match.end)
              ])
            }
          )
        );
      }
    }
  };
};

export default rule;
