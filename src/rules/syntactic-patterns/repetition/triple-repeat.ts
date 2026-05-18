import { splitSentences } from "../../../shared/text/sentences.js";
import { splitWhitespace } from "../../../shared/text/whitespace.js";
import { oneToOneRule } from "../../private/textlint-rule-builders.js";

type RepeatMatch = {
  readonly end: number;
  readonly kind: "frame" | "triple";
  readonly opener: string;
  readonly sentences: readonly string[];
  readonly start: number;
};

const REPEATED_FRAME_PREFIXES = [
  ["the", "answer", "is"],
  ["the", "fix", "is"],
  ["the", "goal", "is"],
  ["the", "lesson", "is"],
  ["the", "point", "is"],
  ["the", "result", "is"],
  ["the", "trick", "is"],
  ["the", "useful", "move"],
  ["what", "helps", "is"],
  ["what", "matters", "is"]
] as const;

function isWordCharacter(character: string): boolean {
  return (
    (character >= "a" && character <= "z") ||
    (character >= "0" && character <= "9") ||
    character === "'"
  );
}

function cleanWord(word: string): string {
  return word
    .toLocaleLowerCase("en")
    .replaceAll("\u2019", "'")
    .replaceAll("\u2018", "'");
}

function trimWordEdges(word: string): string {
  const cleaned = cleanWord(word);
  let start = 0;
  let end = cleaned.length;

  while (start < end && !isWordCharacter(cleaned[start] ?? "")) {
    start += 1;
  }

  while (end > start && !isWordCharacter(cleaned[end - 1] ?? "")) {
    end -= 1;
  }

  return cleaned.slice(start, end);
}

function normalizedWords(sentence: string): string[] {
  return splitWhitespace(sentence).map(trimWordEdges);
}

function firstWord(sentence: string): string | undefined {
  const word = normalizedWords(sentence)[0];
  if (word === undefined) {
    return undefined;
  }

  return word;
}

function framePrefix(sentence: string): string | undefined {
  const words = normalizedWords(sentence);
  const matched = REPEATED_FRAME_PREFIXES.find((prefix) =>
    prefix.every((word, index) => words[index] === word)
  );

  return matched?.join(" ");
}

function findTripleRepeats(text: string): RepeatMatch[] {
  const sentences = splitSentences(text);
  const matches: RepeatMatch[] = [];

  if (sentences.length < 3) {
    return matches;
  }

  for (let index = 0; index <= sentences.length - 3; index += 1) {
    const first = sentences[index];
    const second = sentences[index + 1];
    const third = sentences[index + 2];
    if (first === undefined || second === undefined || third === undefined) {
      continue;
    }

    const firstOpener = firstWord(first.text);
    const secondOpener = firstWord(second.text);
    const thirdOpener = firstWord(third.text);
    if (
      firstOpener === undefined ||
      firstOpener !== secondOpener ||
      secondOpener !== thirdOpener
    ) {
      continue;
    }

    matches.push({
      end: third.end,
      kind: "triple",
      opener: firstOpener,
      sentences: [first.text, second.text, third.text],
      start: first.start
    });
  }

  return matches;
}

function findRepeatedFrames(text: string): RepeatMatch[] {
  const sentences = splitSentences(text);
  const matches: RepeatMatch[] = [];

  if (sentences.length < 2) {
    return matches;
  }

  for (let index = 0; index <= sentences.length - 2; index += 1) {
    const first = sentences[index];
    const second = sentences[index + 1];
    if (first === undefined || second === undefined) {
      continue;
    }

    const firstFrame = framePrefix(first.text);
    const secondFrame = framePrefix(second.text);
    if (
      firstFrame === undefined ||
      firstFrame !== secondFrame ||
      first.text.length > 120 ||
      second.text.length > 120
    ) {
      continue;
    }

    matches.push({
      end: second.end,
      kind: "frame",
      opener: firstFrame,
      sentences: [first.text, second.text],
      start: first.start
    });
  }

  return matches;
}

const rule = oneToOneRule({
  detect: (unit) =>
    [...findTripleRepeats(unit.text), ...findRepeatedFrames(unit.text)].map(
      (match) => ({
        data: { kind: match.kind },
        evidence: match.opener,
        label: match.opener,
        range: { start: match.start, end: match.end }
      })
    ),
  family: "syntactic-patterns",
  formatMessage: (report) =>
    report.detections[0]?.data?.["kind"] === "triple"
      ? `Triple repeat opener found: "${report.evidence}". Vary the sentence openers.`
      : `Repeated sentence frame found: "${report.evidence}". Vary the sentence frame.`,
  ruleId: "syntactic-patterns:triple-repeat",
  unitKind: "paragraph"
});

export default rule;
