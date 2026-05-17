import { wordTokens, type Token } from "../text/tokens.js";

export type PhraseMatch = {
  readonly end: number;
  readonly phrase: string;
  readonly start: number;
  readonly text: string;
};

export type TokenTemplatePattern = {
  readonly id: string;
  readonly slots: Readonly<Record<string, readonly string[]>>;
  readonly templates: readonly string[];
};

export type TokenTemplateMatch = PhraseMatch & {
  readonly patternId: string;
  readonly template: string;
};

type Span = {
  readonly end: number;
  readonly start: number;
};

type TemplatePart =
  | {
      readonly kind: "literal";
      readonly tokens: readonly string[];
    }
  | {
      readonly kind: "slot";
      readonly name: string;
    };

const DOUBLE_QUOTE_OPENERS = new Set(['"', "“"]);
const DOUBLE_QUOTE_CLOSERS = new Set(['"', "”"]);

function phraseTokens(phrase: string): readonly string[] {
  return wordTokens(phrase).map((token) => token.normalized);
}

function tokensMatchAt(
  tokens: readonly Token[],
  phrase: readonly string[],
  startIndex: number
): boolean {
  if (startIndex + phrase.length > tokens.length) {
    return false;
  }

  for (let offset = 0; offset < phrase.length; offset += 1) {
    if (tokens[startIndex + offset]?.normalized !== phrase[offset]) {
      return false;
    }
  }

  return true;
}

function isSlotPart(part: string): boolean {
  return part.startsWith("{") && part.endsWith("}") && part.length > 2;
}

function compileTemplate(template: string): readonly TemplatePart[] {
  return template
    .trim()
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part): TemplatePart => {
      if (isSlotPart(part)) {
        return { kind: "slot", name: part.slice(1, -1) };
      }

      return { kind: "literal", tokens: phraseTokens(part) };
    });
}

function slotValues(
  pattern: TokenTemplatePattern,
  slotName: string
): readonly (readonly string[])[] {
  return (pattern.slots[slotName] ?? [])
    .map((value) => phraseTokens(value))
    .filter((value) => value.length > 0);
}

function matchPart(
  tokens: readonly Token[],
  pattern: TokenTemplatePattern,
  part: TemplatePart,
  startIndex: number
): readonly number[] {
  if (part.kind === "literal") {
    return tokensMatchAt(tokens, part.tokens, startIndex)
      ? [startIndex + part.tokens.length]
      : [];
  }

  return slotValues(pattern, part.name)
    .filter((value) => tokensMatchAt(tokens, value, startIndex))
    .map((value) => startIndex + value.length);
}

function matchTemplateAt(
  tokens: readonly Token[],
  pattern: TokenTemplatePattern,
  parts: readonly TemplatePart[],
  startIndex: number
): readonly number[] {
  let positions: readonly number[] = [startIndex];

  for (const part of parts) {
    positions = positions.flatMap((position) =>
      matchPart(tokens, pattern, part, position)
    );
  }

  return positions;
}

export function findPhraseMatches(
  text: string,
  phrases: readonly string[]
): PhraseMatch[] {
  const tokens = wordTokens(text);
  const matches: PhraseMatch[] = [];

  for (const phrase of phrases) {
    const normalizedPhrase = phraseTokens(phrase);

    if (normalizedPhrase.length === 0) {
      continue;
    }

    for (let index = 0; index < tokens.length; index += 1) {
      if (!tokensMatchAt(tokens, normalizedPhrase, index)) {
        continue;
      }

      const first = tokens[index];
      const last = tokens[index + normalizedPhrase.length - 1];

      if (first === undefined || last === undefined) {
        continue;
      }

      matches.push({
        end: last.end,
        phrase,
        start: first.start,
        text: text.slice(first.start, last.end)
      });
    }
  }

  return matches;
}

function findDoubleQuoteSpans(text: string): readonly Span[] {
  const spans: Span[] = [];
  let quoteStart: number | undefined;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === undefined) {
      continue;
    }

    if (quoteStart === undefined && DOUBLE_QUOTE_OPENERS.has(character)) {
      quoteStart = index;
      continue;
    }

    if (quoteStart !== undefined && DOUBLE_QUOTE_CLOSERS.has(character)) {
      spans.push({ end: index + 1, start: quoteStart });
      quoteStart = undefined;
    }
  }

  if (quoteStart !== undefined) {
    spans.push({ end: text.length, start: quoteStart });
  }

  return spans;
}

function isInsideSpan(
  match: Pick<PhraseMatch, "end" | "start">,
  spans: readonly Span[]
): boolean {
  return spans.some(
    (span) => match.start >= span.start && match.end <= span.end
  );
}

export function findUnquotedPhraseMatches(
  text: string,
  phrases: readonly string[]
): PhraseMatch[] {
  const quoteSpans = findDoubleQuoteSpans(text);

  return findPhraseMatches(text, phrases).filter(
    (match) => !isInsideSpan(match, quoteSpans)
  );
}

export function findTokenTemplateMatches(
  text: string,
  patterns: readonly TokenTemplatePattern[]
): TokenTemplateMatch[] {
  const tokens = wordTokens(text);
  const matches: TokenTemplateMatch[] = [];

  for (const pattern of patterns) {
    for (const template of pattern.templates) {
      const parts = compileTemplate(template);

      for (let index = 0; index < tokens.length; index += 1) {
        const first = tokens[index];
        if (first === undefined) {
          continue;
        }

        for (const endIndex of matchTemplateAt(tokens, pattern, parts, index)) {
          const last = tokens[endIndex - 1];
          if (last === undefined) {
            continue;
          }

          matches.push({
            end: last.end,
            patternId: pattern.id,
            phrase: template,
            start: first.start,
            template,
            text: text.slice(first.start, last.end)
          });
        }
      }
    }
  }

  return matches;
}

export function findUnquotedTokenTemplateMatches(
  text: string,
  patterns: readonly TokenTemplatePattern[]
): TokenTemplateMatch[] {
  const quoteSpans = findDoubleQuoteSpans(text);

  return findTokenTemplateMatches(text, patterns).filter(
    (match) => !isInsideSpan(match, quoteSpans)
  );
}
