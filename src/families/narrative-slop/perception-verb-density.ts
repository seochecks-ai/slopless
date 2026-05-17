import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { allParagraphs } from "../../shared/text/sections.js";
import { splitSentences } from "../../shared/text/sentences.js";
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
  "observing"
]);

const PURPOSE_LOOK_PARTICLES = new Set(["for", "up", "under", "into"]);
const MAX_PARAGRAPH_TOKENS = 80;
const MAX_WINDOW_TOKENS = 45;
const MIN_PARAGRAPH_HITS = 3;
const MIN_WINDOW_HITS = 2;
const WINDOW_SENTENCES = 3;

type DenseMatch = {
  readonly count: number;
  readonly end: number;
  readonly start: number;
  readonly verbs: readonly string[];
};

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

function perceptionTokens(tokens: readonly Token[]): Token[] {
  return tokens.filter((token, index) => {
    return (
      PERCEPTION_VERBS.has(token.normalized) && !isPurposeLook(tokens, index)
    );
  });
}

function denseMatchForSpan(
  text: string,
  start: number,
  end: number,
  minimumHits: number
): DenseMatch | undefined {
  const tokens = wordTokens(text.slice(start, end));
  const hits = perceptionTokens(tokens);

  if (hits.length < minimumHits) {
    return undefined;
  }

  const first = hits[0];
  const last = hits.at(-1);
  if (first === undefined || last === undefined) {
    return undefined;
  }

  return {
    count: hits.length,
    end: start + last.end,
    start: start + first.start,
    verbs: [...new Set(hits.map((token) => token.normalized))]
  };
}

function firstDenseMatch(text: string): DenseMatch | undefined {
  const paragraphTokens = wordTokens(text);
  if (paragraphTokens.length <= MAX_PARAGRAPH_TOKENS) {
    const paragraphMatch = denseMatchForSpan(
      text,
      0,
      text.length,
      MIN_PARAGRAPH_HITS
    );
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

    const windowMatch = denseMatchForSpan(
      text,
      first.start,
      last.end,
      MIN_WINDOW_HITS
    );
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
            `Perception verb density: ${match.count} perception verbs in a short span (${match.verbs.join(", ")}).`,
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
