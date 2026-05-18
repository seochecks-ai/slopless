import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";
import {
  cleanSentence,
  startsWithWords,
  tokens,
  trimTerminalPunctuation
} from "../../../shared/matchers/prose-patterns.js";
import {
  allParagraphSentences,
  type SectionSentence
} from "../../../shared/text/sections.js";

const PREFIXES = ["and ", "but ", "so ", "because "];
const ENOUGH_FOR_SUFFIXES = [" is enough for this", " is enough for that"];
const ABSTRACT_CONTRAST_NOUNS = ["revelations", "vibe", "virtues"];
const ADVISORY_NEGATIVE_NOUNS = ["buffet", "elegance"];
const HUMAN_PLURAL_SUBJECTS = ["kids", "children", "people"];
const IMPERATIVE_CONTRAST_VERBS = ["bring"];
const ADVISORY_MODAL_SUBJECTS = ["i"];
const ADVISORY_MODAL_VERBS = ["give", "expect"];

type Part =
  | { readonly kind: "article" }
  | { readonly kind: "any" }
  | { readonly kind: "exact"; readonly value: string }
  | { readonly kind: "oneOf"; readonly values: readonly string[] };

const ARTICLE: Part = { kind: "article" };
const ANY: Part = { kind: "any" };

function exact(value: string): Part {
  return { kind: "exact", value };
}

function oneOf(values: readonly string[]): Part {
  return { kind: "oneOf", values };
}

function partMatches(word: string | undefined, part: Part): boolean {
  if (word === undefined) {
    return false;
  }

  if (part.kind === "any") {
    return true;
  }
  if (part.kind === "article") {
    return word === "a" || word === "an" || word === "the";
  }
  if (part.kind === "exact") {
    return word === part.value;
  }

  return part.values.includes(word);
}

function matchesPattern(
  words: readonly string[],
  pattern: readonly Part[]
): boolean {
  if (words.length < pattern.length) {
    return false;
  }

  for (let index = 0; index < pattern.length; index += 1) {
    if (!partMatches(words[index], pattern[index] as Part)) {
      return false;
    }
  }

  return true;
}

function matchesArticleNounContrast(
  words: readonly string[],
  leadingVerbs: readonly string[],
  contrastNouns: readonly string[]
): boolean {
  return matchesPattern(words, [
    oneOf(leadingVerbs),
    ARTICLE,
    ANY,
    exact("not"),
    ARTICLE,
    oneOf(contrastNouns)
  ]);
}

function matchesModalArticleNounContrast(words: readonly string[]): boolean {
  return matchesPattern(words, [
    oneOf(ADVISORY_MODAL_SUBJECTS),
    exact("would"),
    oneOf(ADVISORY_MODAL_VERBS),
    ARTICLE,
    ANY,
    exact("not"),
    ARTICLE,
    oneOf(ADVISORY_NEGATIVE_NOUNS)
  ]);
}

function matchesSubjectGetInContrast(words: readonly string[]): boolean {
  return matchesPattern(words, [
    oneOf(HUMAN_PLURAL_SUBJECTS),
    exact("get"),
    ANY,
    exact("in"),
    ANY,
    exact("not"),
    oneOf(ABSTRACT_CONTRAST_NOUNS)
  ]);
}

function matchSingle(sentence: string): string | undefined {
  const stripped = cleanSentence(sentence, PREFIXES);
  const words = tokens(stripped);

  if (
    matchesPattern(words, [
      ANY,
      ANY,
      exact("is"),
      exact("the"),
      exact("part"),
      exact("that"),
      exact("sticks")
    ])
  ) {
    return "part-that-sticks";
  }
  if (
    matchesPattern(words, [
      oneOf(["that", "this", "it"]),
      exact("is"),
      exact("the"),
      exact("part"),
      exact("most"),
      ANY,
      exact("miss")
    ])
  ) {
    return "part-most-x-miss";
  }
  if (
    words.length <= 8 &&
    words.at(-3) === "it" &&
    words.at(-2) === "changes" &&
    words.at(-1) === "everything"
  ) {
    return "it-changes-everything";
  }
  if (
    matchesArticleNounContrast(
      words,
      IMPERATIVE_CONTRAST_VERBS,
      ABSTRACT_CONTRAST_NOUNS
    )
  ) {
    return "imperative-contrast-aphorism";
  }
  if (matchesModalArticleNounContrast(words)) {
    return "modal-advisory-contrast-aphorism";
  }
  if (matchesSubjectGetInContrast(words)) {
    return "reps-not-revelations";
  }
  if (
    words.length <= 10 &&
    startsWithWords(words, ["mostly", "by", "treating"]) &&
    words.includes("like") &&
    words.includes("not") &&
    ABSTRACT_CONTRAST_NOUNS.includes(words.at(-1) ?? "")
  ) {
    return "treating-like-not-virtues";
  }
  if (
    matchesPattern(words, [
      exact("watch"),
      exact("for"),
      ARTICLE,
      exact("pattern"),
      exact("not"),
      exact("one"),
      exact("bad"),
      ANY
    ])
  ) {
    return "watch-for-pattern-not-week";
  }
  if (
    matchesPattern(words, [
      ANY,
      ANY,
      ANY,
      exact("like"),
      ARTICLE,
      ANY,
      exact("problem"),
      exact("not"),
      ARTICLE,
      ANY,
      exact("problem")
    ])
  ) {
    return "like-a-problem-not-a-problem";
  }

  return undefined;
}

function matchCurriculumPair(
  first: string,
  second: string
): string | undefined {
  const a = trimTerminalPunctuation(cleanSentence(first, PREFIXES));
  const b = trimTerminalPunctuation(cleanSentence(second, PREFIXES));

  for (const suffix of ENOUGH_FOR_SUFFIXES) {
    if (!a.endsWith(suffix)) {
      continue;
    }

    const subject = a.slice(0, -suffix.length);
    if (subject.length > 0 && b === `${subject} is the curriculum`) {
      return "x-is-enough-x-is-curriculum";
    }
  }

  return undefined;
}

function reportSentence(
  context: Readonly<TextlintRuleContext>,
  item: SectionSentence,
  signal: string
): void {
  emitTextlintFinding(context, {
    node: item.paragraph,
    ruleId: "syntactic-patterns:contrastive-aphorism",
    message: `Contrastive aphorism found: ${signal}. Replace the slogan with a concrete claim.`,
    range: {
      start: item.source.originalStartFor(item.sentence.start),
      end: item.source.originalEndFor(item.sentence.end)
    }
  });
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      const sentences = allParagraphSentences(node);

      for (const item of sentences) {
        const signal = matchSingle(item.sentence.text);
        if (signal !== undefined) {
          reportSentence(context, item, signal);
        }
      }

      for (let index = 0; index < sentences.length - 1; index += 1) {
        const current = sentences[index];
        const next = sentences[index + 1];
        if (current === undefined || next === undefined) {
          continue;
        }

        const signal = matchCurriculumPair(
          current.sentence.text,
          next.sentence.text
        );
        if (signal !== undefined) {
          reportSentence(context, current, signal);
        }
      }
    }
  };
};

export default rule;
