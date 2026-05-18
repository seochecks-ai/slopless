import { countWhitespaceSeparatedWords } from "../../shared/text/whitespace.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const MAX_DRAMATIC_AFTER_COLON_WORDS = 5;
const CONTENT_REFERENCE_MARKER = ":contentReference[";

type DramaticColonMatch = {
  readonly end: number;
  readonly start: number;
  readonly text: string;
};

function firstNonWhitespaceIndex(text: string): number | undefined {
  for (let index = 0; index < text.length; index += 1) {
    if (text[index]?.trim() !== "") {
      return index;
    }
  }

  return undefined;
}

function trimEndIndex(text: string): number {
  for (let index = text.length; index > 0; index -= 1) {
    if (text[index - 1]?.trim() !== "") {
      return index;
    }
  }

  return 0;
}

function containsComma(text: string): boolean {
  for (const character of text) {
    if (character === ",") {
      return true;
    }
  }

  return false;
}

function isMeridiemInnerPeriod(text: string, index: number): boolean {
  const previous = text[index - 1]?.toLocaleLowerCase();
  const next = text[index + 1]?.toLocaleLowerCase();

  return (previous === "a" || previous === "p") && next === "m";
}

function sentenceEndWithClosingQuotes(text: string, index: number): number {
  let end = index + 1;

  while (
    text[end] === '"' ||
    text[end] === "\u201D" ||
    text[end] === "\u2019"
  ) {
    end += 1;
  }

  return end;
}

function sentenceEndAfter(text: string, start: number): number {
  for (let index = start; index < text.length; index += 1) {
    const character = text[index];
    if (character === "." && isMeridiemInnerPeriod(text, index)) {
      continue;
    }

    if (character === "." || character === "?" || character === "!") {
      return sentenceEndWithClosingQuotes(text, index);
    }
  }

  return text.length;
}

function dramaticColonAt(
  text: string,
  colonIndex: number
): DramaticColonMatch | undefined {
  if (isArtifactColon(text, colonIndex)) {
    return undefined;
  }

  const end = sentenceEndAfter(text, colonIndex + 1);
  const afterColon = text.slice(colonIndex + 1, end);
  const trimStart = firstNonWhitespaceIndex(afterColon);
  if (trimStart === undefined) {
    return undefined;
  }

  const trimEnd = trimEndIndex(afterColon);
  const trimmed = afterColon.slice(trimStart, trimEnd);

  if (containsComma(trimmed)) {
    return undefined;
  }

  if (countWhitespaceSeparatedWords(trimmed) > MAX_DRAMATIC_AFTER_COLON_WORDS) {
    return undefined;
  }

  return {
    end: colonIndex + 1 + trimEnd,
    start: colonIndex + 1 + trimStart,
    text: trimmed
  };
}

function isArtifactColon(text: string, colonIndex: number): boolean {
  const lowercase = text.toLocaleLowerCase("en");
  const before = lowercase.slice(Math.max(0, colonIndex - 12), colonIndex + 1);

  return (
    lowercase.startsWith(
      CONTENT_REFERENCE_MARKER.toLocaleLowerCase("en"),
      colonIndex
    ) ||
    before.endsWith("[oaicite:") ||
    before.endsWith("sandbox:") ||
    text[colonIndex + 1] === "/"
  );
}

function findDramaticColonMatches(text: string): DramaticColonMatch[] {
  const matches: DramaticColonMatch[] = [];

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== ":") {
      continue;
    }

    const match = dramaticColonAt(text, index);
    if (match === undefined) {
      continue;
    }

    matches.push(match);
  }

  return matches;
}

const rule = oneToOneRule({
  detect: (unit) =>
    findDramaticColonMatches(unit.text).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "orthography",
  formatMessage: (report) =>
    `Dramatic colon found: "${report.evidence}". Rewrite without the short reveal after the colon.`,
  ruleId: "orthography:colon-dramatic",
  unitKind: "paragraph"
});

export default rule;
