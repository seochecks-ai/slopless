import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import {
  cleanSentence,
  tokens
} from "../../../shared/matchers/prose-patterns.js";
import { allParagraphSentences } from "../../../shared/text/sections.js";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";

const PREFIXES = ["and ", "but ", "so ", "because "];
const EMPHASIS_REFERENTS = ["part", "bit"];
const EMPHASIS_QUALIFIERS = ["last", "first", "main"];
const WEAKENING_REFERENTS = ["pattern", "cycle", "loop"];
const EMPTY_VIRTUE_LABELS = ["discipline"];

function isDeictic(token: string | undefined): boolean {
  return token === "that" || token === "this";
}

function matchesPartMatters(words: readonly string[]): boolean {
  const [first, second, third, fourth, fifth, sixth] = words;

  return (
    (words.length === 3 &&
      isDeictic(first) &&
      second !== undefined &&
      EMPHASIS_REFERENTS.includes(second) &&
      third === "matters") ||
    (words.length === 4 &&
      isDeictic(first) &&
      second !== undefined &&
      third !== undefined &&
      EMPHASIS_QUALIFIERS.includes(second) &&
      EMPHASIS_REFERENTS.includes(third) &&
      fourth === "matters") ||
    (words.length === 6 &&
      isDeictic(first) &&
      second === "one" &&
      third === "change" &&
      fourth === "helped" &&
      fifth === "a" &&
      sixth === "lot")
  );
}

function matchDeicticIsFrame(words: readonly string[]): string | undefined {
  const [first, second, third, fourth, fifth, sixth] = words;
  const startsWithDeicticIs = isDeictic(first) && second === "is";

  if (
    words.length === 5 &&
    startsWithDeicticIs &&
    third === "telling" &&
    fourth === "you" &&
    fifth === "something"
  ) {
    return "deictic-telling-you-something";
  }

  if (
    words.length === 5 &&
    startsWithDeicticIs &&
    third === "still" &&
    fourth === "real" &&
    fifth === "change"
  ) {
    return "deictic-real-change";
  }

  if (
    words.length === 6 &&
    startsWithDeicticIs &&
    third === "how" &&
    fourth === "the" &&
    fifth !== undefined &&
    WEAKENING_REFERENTS.includes(fifth) &&
    sixth === "weakens"
  ) {
    return "deictic-pattern-weakens";
  }

  if (
    words.length === 3 &&
    startsWithDeicticIs &&
    third !== undefined &&
    EMPTY_VIRTUE_LABELS.includes(third)
  ) {
    return "deictic-empty-virtue-label";
  }

  return undefined;
}

function matchWhatHelpsFrame(words: readonly string[]): string | undefined {
  const [first, second, third, fourth, fifth] = words;

  if (
    words.length === 5 &&
    first === "what" &&
    second === "helps" &&
    third === "is" &&
    fourth === "not" &&
    fifth === "brilliant"
  ) {
    return "what-helps-not-brilliant";
  }

  return undefined;
}

function matchEmptyEmphasis(sentence: string): string | undefined {
  const words = tokens(cleanSentence(sentence, PREFIXES));

  if (matchesPartMatters(words)) {
    return words.length === 6
      ? "deictic-change-helped"
      : "deictic-part-matters";
  }

  return matchDeicticIsFrame(words) ?? matchWhatHelpsFrame(words);
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        const matched = matchEmptyEmphasis(item.sentence.text);
        if (matched === undefined) {
          continue;
        }

        emitTextlintFinding(context, {
          node: item.paragraph,
          ruleId: "syntactic-patterns:empty-emphasis",
          message: `Empty emphasis found: ${matched}. Replace the filler line with the actual point.`,
          range: {
            start: item.source.originalStartFor(item.sentence.start),
            end: item.source.originalEndFor(item.sentence.end)
          }
        });
      }
    }
  };
};

export default rule;
