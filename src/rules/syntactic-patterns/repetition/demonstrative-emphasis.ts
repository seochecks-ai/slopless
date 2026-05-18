import type { TxtParentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import {
  type SplitSentence,
  splitSentences
} from "../../../shared/text/sentences.js";
import { sourceText } from "../../../shared/text/traverse.js";
import { splitWhitespace } from "../../../shared/text/whitespace.js";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";

const MAX_SENTENCE_WORDS = 12;
const MAX_PER_DOCUMENT = 2;

const EMPHATIC_INTRANSITIVE_VERBS = new Set([
  "matters",
  "counts",
  "helps",
  "works",
  "fails",
  "hurts",
  "sticks",
  "lasts",
  "applies",
  "holds",
  "wins",
  "dies",
  "burns",
  "stops",
  "ends",
  "begins",
  "remains",
  "follows"
]);

const DEMONSTRATIVE_SUBJECTS = new Set(["that", "this", "these", "those"]);
const DEFINITE_DETERMINERS = new Set(["the", "that", "this", "these", "those"]);
const COPULAR_VERBS = new Set(["is", "are", "was", "were"]);
const RELATIVE_TAILS = new Set(["where", "how", "why", "what", "when", "who"]);
const PERCEPTION_VERBS = new Set([
  "looks",
  "look",
  "seems",
  "seem",
  "sounds",
  "sound",
  "feels",
  "feel",
  "appears",
  "appear"
]);
const STOP_WORD_NEXT_WORD = new Set([
  "the",
  "a",
  "an",
  "it",
  "he",
  "she",
  "they",
  "we",
  "you",
  "i",
  "of",
  "in",
  "on",
  "at",
  "by",
  "for",
  "to",
  "from",
  "with",
  "about",
  "into",
  "than",
  "as",
  "and",
  "or",
  "but"
]);

const LEADING_PREFIXES = ["so ", "but ", "and ", "however, ", "however "];

type DemonstrativeMatch = {
  readonly end: number;
  readonly kind: string;
  readonly node: TxtParentNode;
  readonly sentence: string;
  readonly sourceEnd: (end: number) => number;
  readonly sourceStart: (start: number) => number;
  readonly start: number;
};

function normalizeText(text: string): string {
  let normalized = "";

  for (const character of text.toLocaleLowerCase("en")) {
    const lower = character.toLocaleLowerCase("en");
    const upper = character.toLocaleUpperCase("en");
    if (
      character.trim() === "" ||
      character === "'" ||
      (character >= "0" && character <= "9") ||
      lower !== upper
    ) {
      normalized += character;
      continue;
    }

    normalized += " ";
  }

  return splitWhitespace(normalized).join(" ");
}

function stripLeadingPrefix(text: string): string {
  for (const prefix of LEADING_PREFIXES) {
    if (text.startsWith(prefix)) {
      return text.slice(prefix.length);
    }
  }

  return text;
}

function classifyDemonstrativeEmphaticVerb(
  tokens: readonly string[]
): string | undefined {
  if (tokens.length < 3 || tokens.length > 5) {
    return undefined;
  }

  if (!DEMONSTRATIVE_SUBJECTS.has(tokens[0] ?? "")) {
    return undefined;
  }

  const last = tokens[tokens.length - 1];
  if (last === undefined || !EMPHATIC_INTRANSITIVE_VERBS.has(last)) {
    return undefined;
  }

  return "demonstrative-emphatic-verb";
}

function classifyDemonstrativeRelative(
  tokens: readonly string[]
): string | undefined {
  if (tokens.length < 4) {
    return undefined;
  }

  if (!DEMONSTRATIVE_SUBJECTS.has(tokens[0] ?? "")) {
    return undefined;
  }

  if (!COPULAR_VERBS.has(tokens[1] ?? "")) {
    return undefined;
  }

  return RELATIVE_TAILS.has(tokens[2] ?? "")
    ? "demonstrative-relative"
    : undefined;
}

function classifyDemonstrativePerception(
  tokens: readonly string[]
): string | undefined {
  if (!DEMONSTRATIVE_SUBJECTS.has(tokens[0] ?? "")) {
    return undefined;
  }

  return PERCEPTION_VERBS.has(tokens[1] ?? "")
    ? "demonstrative-perception"
    : undefined;
}

function classifyDemonstrativeCopular(
  tokens: readonly string[]
): string | undefined {
  if (!DEMONSTRATIVE_SUBJECTS.has(tokens[0] ?? "")) {
    return undefined;
  }

  if (!COPULAR_VERBS.has(tokens[1] ?? "")) {
    return undefined;
  }

  const predicateStart = tokens[2];
  if (predicateStart === undefined || RELATIVE_TAILS.has(predicateStart)) {
    return undefined;
  }

  return STOP_WORD_NEXT_WORD.has(predicateStart)
    ? undefined
    : "demonstrative-copular";
}

function classifyDefiniteShortCopular(
  tokens: readonly string[]
): string | undefined {
  if (!DEFINITE_DETERMINERS.has(tokens[0] ?? "")) {
    return undefined;
  }

  const copulaIndex = tokens.findIndex((token) => COPULAR_VERBS.has(token));
  if (copulaIndex < 2 || copulaIndex > 4) {
    return undefined;
  }

  const firstPredicate = tokens[copulaIndex + 1];
  if (
    firstPredicate === undefined ||
    firstPredicate === "not" ||
    !DEFINITE_DETERMINERS.has(firstPredicate)
  ) {
    return undefined;
  }

  return "definite-np-copular";
}

function classifyDemonstrativeNpCopular(
  tokens: readonly string[]
): string | undefined {
  if (tokens.length < 3 || !DEMONSTRATIVE_SUBJECTS.has(tokens[0] ?? "")) {
    return undefined;
  }

  const maxHeadWindow = Math.min(tokens.length, 4);
  for (let index = 1; index < maxHeadWindow; index += 1) {
    const token = tokens[index];
    if (token === undefined || !COPULAR_VERBS.has(token)) {
      continue;
    }

    if (index < 2) {
      continue;
    }

    const firstPredicate = tokens[index + 1];
    if (firstPredicate === "not") {
      return "demonstrative-np-negation";
    }

    if (firstPredicate !== undefined && RELATIVE_TAILS.has(firstPredicate)) {
      return "demonstrative-np-relative";
    }

    if (
      firstPredicate !== undefined &&
      !STOP_WORD_NEXT_WORD.has(firstPredicate)
    ) {
      return "demonstrative-np-copular";
    }
  }

  return undefined;
}

function classify(sentence: SplitSentence): string | undefined {
  const normalized = normalizeText(sentence.text);
  const stripped = stripLeadingPrefix(normalized);
  const tokens = splitWhitespace(stripped);
  if (tokens.length < 3 || tokens.length > MAX_SENTENCE_WORDS) {
    return undefined;
  }

  return (
    classifyDemonstrativeRelative(tokens) ??
    classifyDemonstrativePerception(tokens) ??
    classifyDemonstrativeCopular(tokens) ??
    classifyDefiniteShortCopular(tokens) ??
    classifyDemonstrativeNpCopular(tokens) ??
    classifyDemonstrativeEmphaticVerb(tokens)
  );
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;
  const helper = new RuleHelper(context);
  const ignoredParents = [
    Syntax.List,
    Syntax.ListItem,
    Syntax.Table,
    Syntax.TableCell
  ];
  const matches: DemonstrativeMatch[] = [];

  return {
    [Syntax.Paragraph](node: TxtParentNode): void {
      if (helper.isChildNode(node, ignoredParents)) {
        return;
      }

      const source = sourceText(node);
      for (const sentence of splitSentences(source.text)) {
        const kind = classify(sentence);
        if (kind === undefined) {
          continue;
        }

        matches.push({
          end: sentence.end,
          kind,
          node,
          sentence: sentence.text,
          sourceEnd: source.originalEndFor,
          sourceStart: source.originalStartFor,
          start: sentence.start
        });
      }
    },

    [Syntax.DocumentExit](): void {
      if (matches.length <= MAX_PER_DOCUMENT) {
        return;
      }

      for (const match of matches) {
        emitTextlintFinding(context, {
          node: match.node,
          ruleId: "syntactic-patterns:demonstrative-emphasis",
          message: `Demonstrative emphasis found: "${match.sentence}". Reduce repeated short emphasis lines.`,
          range: {
            start: match.sourceStart(match.start),
            end: match.sourceEnd(match.end)
          }
        });
      }
    }
  };
};

export default rule;
