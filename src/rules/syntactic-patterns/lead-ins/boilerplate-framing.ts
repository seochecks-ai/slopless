import {
  cleanSentence,
  tokens,
  tokensContainInOrder
} from "../../../shared/matchers/prose-patterns.js";
import { oneToOneRule } from "../../private/textlint-rule-builders.js";

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

const rule = oneToOneRule({
  detect: (unit) =>
    matchBoilerplateFraming(unit.text).map((signal) => ({
      evidence: signal,
      label: signal,
      range: { start: 0, end: unit.text.length }
    })),
  family: "syntactic-patterns",
  formatMessage: (report) =>
    `Boilerplate framing found: ${report.evidence}. Start with the specific point.`,
  ruleId: "syntactic-patterns:boilerplate-framing",
  unitKind: "sentence"
});

export default rule;
