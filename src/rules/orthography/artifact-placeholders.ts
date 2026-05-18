import type { TxtLinkNode, TxtStrNode } from "@textlint/ast-node-types";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

type ArtifactMatch = {
  readonly end: number;
  readonly label: string;
  readonly start: number;
  readonly text: string;
};

type ExactArtifact = {
  readonly label: string;
  readonly pattern: string;
};

type Span = {
  readonly end: number;
  readonly start: number;
};

const EXACT_ARTIFACTS: readonly ExactArtifact[] = [
  { label: "OpenAI citation object", pattern: "oai_citation" },
  { label: "OpenAI sandbox path", pattern: "sandbox:/mnt/data/" },
  { label: "ChatGPT tracking marker", pattern: "utm_source=chatgpt.com" },
  { label: "OpenAI tracking marker", pattern: "utm_source=openai" },
  { label: "unfinished citation placeholder", pattern: "[CITATION NEEDED]" },
  { label: "unfinished insert placeholder", pattern: "[INSERT TEXT]" },
  { label: "unfinished placeholder", pattern: "[PLACEHOLDER]" },
  { label: "placeholder text", pattern: "Lorem ipsum" }
];

const DOUBLE_QUOTE_OPENERS = new Set(['"', "\u201C"]);
const DOUBLE_QUOTE_CLOSERS = new Set(['"', "\u201D"]);

function lower(text: string): string {
  return text.toLocaleLowerCase("en");
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

  return spans;
}

function isInsideSpan(match: ArtifactMatch, spans: readonly Span[]): boolean {
  return spans.some(
    (span) => match.start >= span.start && match.end <= span.end
  );
}

function withoutNestedMatches(
  matches: readonly ArtifactMatch[]
): readonly ArtifactMatch[] {
  return matches.filter(
    (match, index) =>
      !matches.some(
        (other, otherIndex) =>
          otherIndex !== index &&
          match.start > other.start &&
          match.end < other.end
      )
  );
}

function findExactArtifactMatches(text: string): readonly ArtifactMatch[] {
  const matches: ArtifactMatch[] = [];
  const normalized = lower(text);

  for (const artifact of EXACT_ARTIFACTS) {
    const pattern = lower(artifact.pattern);
    let start = normalized.indexOf(pattern);

    while (start >= 0) {
      const end = start + artifact.pattern.length;
      matches.push({
        end,
        label: artifact.label,
        start,
        text: text.slice(start, end)
      });
      start = normalized.indexOf(pattern, end);
    }
  }

  return matches;
}

function findDelimitedArtifactMatches(
  text: string,
  marker: string,
  endCharacter: string,
  label: string
): readonly ArtifactMatch[] {
  const matches: ArtifactMatch[] = [];
  const normalized = lower(text);
  const normalizedMarker = lower(marker);
  let start = normalized.indexOf(normalizedMarker);

  while (start >= 0) {
    const endIndex = text.indexOf(endCharacter, start + marker.length);
    const end =
      endIndex >= 0 ? endIndex + endCharacter.length : start + marker.length;
    matches.push({
      end,
      label,
      start,
      text: text.slice(start, end)
    });
    start = normalized.indexOf(normalizedMarker, end);
  }

  return matches;
}

function findArtifactMatches(text: string): readonly ArtifactMatch[] {
  const quoteSpans = findDoubleQuoteSpans(text);
  return withoutNestedMatches([
    ...findDelimitedArtifactMatches(
      text,
      ":contentReference[oaicite:",
      "}",
      "OpenAI citation marker"
    ),
    ...findDelimitedArtifactMatches(
      text,
      "[oaicite:",
      "]",
      "OpenAI citation marker"
    ),
    ...findExactArtifactMatches(text)
  ]).filter((match) => !isInsideSpan(match, quoteSpans));
}

function reportMatches(
  context: TextlintRuleContext,
  node: TxtLinkNode | TxtStrNode,
  matches: readonly ArtifactMatch[],
  offset: number
): void {
  for (const match of matches) {
    emitTextlintFinding(context, {
      node,
      ruleId: "orthography:artifact-placeholders",
      message: `Artifact placeholder found: ${match.label}. Remove generated or unfinished placeholder residue.`,
      range: {
        start: offset + match.start,
        end: offset + match.end
      }
    });
  }
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax, getSource } = context;
  const helper = new RuleHelper(context);
  const ignoredParents = [Syntax.BlockQuote];

  return {
    [Syntax.Str](node: TxtStrNode): void {
      if (helper.isChildNode(node, ignoredParents)) {
        return;
      }

      reportMatches(context, node, findArtifactMatches(getSource(node)), 0);
    },

    [Syntax.Link](node: TxtLinkNode): void {
      if (helper.isChildNode(node, ignoredParents)) {
        return;
      }

      const raw = getSource(node);
      const urlOffset = raw.indexOf(node.url);
      const offset = urlOffset >= 0 ? urlOffset : 0;
      reportMatches(context, node, findArtifactMatches(node.url), offset);
    }
  };
};

export default rule;
