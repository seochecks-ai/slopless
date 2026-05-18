import type { TxtHeaderNode } from "@textlint/ast-node-types";
import { splitWhitespace } from "../../shared/text/whitespace.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const MAX_CAPITALIZED_NON_FIRST_WORDS = 2;
const MAX_RUST_HEADING_DEPTH = 2;

function isUppercaseLetter(character: string): boolean {
  const lower = character.toLocaleLowerCase();
  const upper = character.toLocaleUpperCase();

  return lower !== upper && character === upper;
}

function hasLowercaseLetter(text: string): boolean {
  for (const character of text) {
    const lower = character.toLocaleLowerCase();
    const upper = character.toLocaleUpperCase();

    if (lower !== upper && character === lower) {
      return true;
    }
  }

  return false;
}

function isTitleCased(word: string): boolean {
  const first = word[0];
  if (first === undefined || !isUppercaseLetter(first)) {
    return false;
  }

  return hasLowercaseLetter(word.slice(1));
}

function countCapitalizedNonFirstWords(text: string): number {
  let count = 0;
  const words = splitWhitespace(text);

  for (let index = 1; index < words.length; index += 1) {
    const word = words[index];
    if (word !== undefined && isTitleCased(word)) {
      count += 1;
    }
  }

  return count;
}

const rule = oneToOneRule({
  detect: (unit) => {
    const node = unit.node as TxtHeaderNode;
    if (node.depth > MAX_RUST_HEADING_DEPTH) {
      return [];
    }

    const count = countCapitalizedNonFirstWords(unit.text);
    if (count <= MAX_CAPITALIZED_NON_FIRST_WORDS) {
      return [];
    }

    return [
      {
        evidence: String(count),
        label: "title-case heading",
        range: { start: 0, end: unit.text.length }
      }
    ];
  },
  family: "orthography",
  formatMessage: (report) =>
    `Heading looks like title case. Use sentence case; found ${report.evidence} capitalized non-first words.`,
  ignoredAncestorTypes: ["List", "ListItem", "Table", "TableCell"],
  ruleId: "orthography:sentence-case",
  unitKind: "heading"
});

export default rule;
