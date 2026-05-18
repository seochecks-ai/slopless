import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import {
  cleanSentence,
  tokens,
  tokensContainInOrder
} from "../../../shared/matchers/prose-patterns.js";
import { allParagraphSentences } from "../../../shared/text/sections.js";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";

const PREFIXES = ["however, ", "but ", "and ", "so ", "that being said, "];
const VAGUE_INTROS = [
  "some",
  "common",
  "certain",
  "several",
  "following",
  "many",
  "key",
  "main"
];
const CATEGORY_WORDS = [
  "examples",
  "types",
  "reasons",
  "factors",
  "foods",
  "triggers",
  "ways",
  "steps",
  "sections",
  "parts",
  "points",
  "things"
];
const PREVIEW_OBJECTS = [
  "sections",
  "section",
  "parts",
  "part",
  "pages",
  "page"
];
const PREVIEW_VERBS = ["explore", "discuss", "examine", "cover"];
const REASON_STARTERS = ["reason", "factor", "point", "thing"];
const ORDINAL_STARTERS = ["one", "another"];

function matchEnumerationPreface(words: readonly string[]): string | undefined {
  if (
    words.some((word) => VAGUE_INTROS.includes(word)) &&
    words.some((word) => CATEGORY_WORDS.includes(word)) &&
    words.some((word) => word === "include" || word === "includes")
  ) {
    return "vague-category-include";
  }

  return undefined;
}

function matchStarterFrame(words: readonly string[]): string | undefined {
  const [first, second, third] = words;

  if (
    first !== undefined &&
    second !== undefined &&
    third === "is" &&
    ORDINAL_STARTERS.includes(first) &&
    REASON_STARTERS.includes(second)
  ) {
    return `${first}-${second}-is`;
  }

  return undefined;
}

function matchBoilerplateFraming(sentence: string): string[] {
  const stripped = cleanSentence(sentence, PREFIXES);
  const words = tokens(stripped);
  const matches: string[] = [];

  if (
    tokensContainInOrder(words, [["following"], PREVIEW_OBJECTS, PREVIEW_VERBS])
  ) {
    matches.push("following + explore");
  }
  if (stripped.includes("when it comes to")) {
    matches.push("when it comes to");
  }
  if (
    tokensContainInOrder(words, [
      ["there"],
      ["are"],
      ["certain", "common"],
      CATEGORY_WORDS
    ])
  ) {
    matches.push("there are certain/common");
  }

  const enumeration = matchEnumerationPreface(words);
  if (enumeration !== undefined) {
    matches.push(enumeration);
  }

  const starter = matchStarterFrame(words);
  if (starter !== undefined) {
    matches.push(starter);
  }

  return matches;
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        for (const signal of matchBoilerplateFraming(item.sentence.text)) {
          emitTextlintFinding(context, {
            node: item.paragraph,
            ruleId: "syntactic-patterns:boilerplate-framing",
            message: `Boilerplate framing found: ${signal}. Start with the specific point.`,
            range: {
              start: item.source.originalStartFor(item.sentence.start),
              end: item.source.originalEndFor(item.sentence.end)
            }
          });
        }
      }
    }
  };
};

export default rule;
