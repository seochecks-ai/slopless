import {
  COPULAR_FORMS,
  DO_NEGATIONS,
  EXPLICIT_DO_AUXILIARIES,
  skipOptionalAdverbs,
  startsWithWords,
  validSubject,
  words
} from "./negation-reframe-parts.js";
import { wordTokens, type Token } from "../../../../shared/text/tokens.js";

export type BlockNegationReframeMatch = {
  readonly end: number;
  readonly start: number;
  readonly text: string;
};

type TextBlock = {
  readonly end: number;
  readonly start: number;
  readonly text: string;
};

const LEADING_BLOCK_PIVOTS = new Set(["and", "but", "so"]);
const MAX_BLOCK_REFRAME_LOOKAHEAD = 4;
const OPTIONAL_NOT_FOLLOWERS = new Set(["just", "only", "merely"]);

function firstNonWhitespaceIndex(text: string): number | undefined {
  for (let index = 0; index < text.length; index += 1) {
    if (text[index]?.trim() !== "") {
      return index;
    }
  }

  return undefined;
}

function trimmedBlockEnd(text: string, start: number, end: number): number {
  for (let index = end; index > start; index -= 1) {
    if (text[index - 1]?.trim() !== "") {
      return index;
    }
  }

  return start;
}

function pushBlock(
  blocks: TextBlock[],
  text: string,
  start: number,
  end: number
): void {
  const raw = text.slice(start, end);
  const trimStart = firstNonWhitespaceIndex(raw);
  if (trimStart === undefined) {
    return;
  }

  const blockStart = start + trimStart;
  const blockEnd = trimmedBlockEnd(text, blockStart, end);

  blocks.push({
    end: blockEnd,
    start: blockStart,
    text: text.slice(blockStart, blockEnd)
  });
}

function blankLineBreakLength(text: string, index: number): number {
  if (text[index] !== "\n") {
    return 0;
  }

  let next = index + 1;
  while (text[next] === " " || text[next] === "\t") {
    next += 1;
  }

  return text[next] === "\n" ? next - index + 1 : 0;
}

function textBlocks(text: string): readonly TextBlock[] {
  const blocks: TextBlock[] = [];
  let start = 0;
  let index = 0;

  while (index < text.length) {
    const breakLength = blankLineBreakLength(text, index);
    if (breakLength === 0) {
      index += 1;
      continue;
    }

    pushBlock(blocks, text, start, index);
    index += breakLength;
    start = index;
  }

  pushBlock(blocks, text, start, text.length);
  return blocks;
}

function stripLeadingBlockPivot(tokens: readonly Token[]): readonly Token[] {
  return LEADING_BLOCK_PIVOTS.has(tokens[0]?.normalized ?? "")
    ? tokens.slice(1)
    : tokens;
}

function colonNegatedSubject(tokens: readonly Token[]): readonly string[] {
  const tokenWords = words(stripLeadingBlockPivot(tokens));

  for (let index = 0; index < tokenWords.length - 1; index += 1) {
    const auxiliary = COPULAR_FORMS.get(tokenWords[index] ?? "");
    const subject = tokenWords.slice(0, index);

    if (
      auxiliary !== undefined &&
      tokenWords[index + 1] === "not" &&
      (index + 2 === tokenWords.length ||
        (OPTIONAL_NOT_FOLLOWERS.has(tokenWords[index + 2] ?? "") &&
          index + 3 === tokenWords.length)) &&
      validSubject(subject)
    ) {
      return subject;
    }
  }

  return [];
}

function sameSubjectAffirmativeBlock(
  tokens: readonly Token[],
  subject: readonly string[]
): boolean {
  const blockTokens = stripLeadingBlockPivot(tokens);
  const tokenWords = words(blockTokens);

  return (
    startsWithWords(blockTokens, subject) &&
    COPULAR_FORMS.get(tokenWords[subject.length] ?? "") !== undefined &&
    tokenWords[subject.length + 1] === undefined
  );
}

function pronounAffirmativeBlock(tokens: readonly Token[]): boolean {
  const blockTokens = stripLeadingBlockPivot(tokens);
  const tokenWords = words(blockTokens);

  return (
    (startsWithWords(blockTokens, ["it"]) ||
      startsWithWords(blockTokens, ["this"]) ||
      startsWithWords(blockTokens, ["that"])) &&
    COPULAR_FORMS.get(tokenWords[1] ?? "") !== undefined &&
    tokenWords[2] === undefined
  );
}

function makeNegatedSubject(tokens: readonly Token[]): readonly string[] {
  const tokenWords = words(stripLeadingBlockPivot(tokens));

  for (let index = 0; index < tokenWords.length; index += 1) {
    const current = tokenWords[index];
    const next = tokenWords[index + 1];
    const subject = tokenWords.slice(0, index);

    if (!validSubject(subject)) {
      continue;
    }

    if (DO_NEGATIONS.has(current ?? "")) {
      const makeIndex = skipOptionalAdverbs(tokenWords, index + 1);
      if (tokenWords[makeIndex] === "make") {
        return subject;
      }
    }

    if (EXPLICIT_DO_AUXILIARIES.has(current ?? "") && next === "not") {
      const makeIndex = skipOptionalAdverbs(tokenWords, index + 2);
      if (tokenWords[makeIndex] === "make") {
        return subject;
      }
    }
  }

  return [];
}

function meaningAffirmativeBlock(
  tokens: readonly Token[],
  subject: readonly string[]
): boolean {
  const blockTokens = stripLeadingBlockPivot(tokens);

  return (
    startsWithWords(blockTokens, [...subject, "does", "mean"]) ||
    startsWithWords(blockTokens, [...subject, "do", "mean"]) ||
    startsWithWords(blockTokens, ["it", "means"]) ||
    startsWithWords(blockTokens, ["it", "does", "mean"]) ||
    startsWithWords(blockTokens, ["this", "means"]) ||
    startsWithWords(blockTokens, ["this", "does", "mean"])
  );
}

function blockSentencePairReframe(
  blocks: readonly TextBlock[],
  index: number
): BlockNegationReframeMatch | undefined {
  const current = blocks[index];
  const next = blocks[index + 1];

  if (current === undefined || next === undefined) {
    return undefined;
  }

  const subject = makeNegatedSubject(wordTokens(current.text));
  if (subject.length === 0) {
    return undefined;
  }

  if (!meaningAffirmativeBlock(wordTokens(next.text), subject)) {
    return undefined;
  }

  return {
    end: next.end,
    start: current.start,
    text: `${current.text} ${next.text}`
  };
}

function blockPairReframe(
  blocks: readonly TextBlock[],
  index: number
): BlockNegationReframeMatch | undefined {
  const current = blocks[index];
  if (current?.text.trimEnd().endsWith(":") !== true) {
    return undefined;
  }

  const subject = colonNegatedSubject(wordTokens(current.text));
  if (subject.length === 0) {
    return undefined;
  }

  const end = Math.min(blocks.length, index + MAX_BLOCK_REFRAME_LOOKAHEAD + 1);
  for (let nextIndex = index + 1; nextIndex < end; nextIndex += 1) {
    const candidate = blocks[nextIndex];
    if (candidate?.text.trimEnd().endsWith(":") !== true) {
      continue;
    }

    const candidateTokens = wordTokens(candidate.text);
    if (
      sameSubjectAffirmativeBlock(candidateTokens, subject) ||
      pronounAffirmativeBlock(candidateTokens)
    ) {
      return {
        end: candidate.end,
        start: current.start,
        text: blocks
          .slice(index, nextIndex + 1)
          .map((block) => block.text)
          .join(" ")
      };
    }
  }

  return undefined;
}

export function findBlockNegationReframes(
  text: string
): BlockNegationReframeMatch[] {
  const matches: BlockNegationReframeMatch[] = [];
  const blocks = textBlocks(text);

  for (let index = 0; index < blocks.length - 1; index += 1) {
    const blockMatch =
      blockPairReframe(blocks, index) ??
      blockSentencePairReframe(blocks, index);

    if (blockMatch !== undefined) {
      matches.push(blockMatch);
    }
  }

  return matches;
}
