import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import {
  cleanSentence,
  tokens,
  startsWithWords
} from "../../../shared/matchers/prose-patterns.js";
import { allParagraphSentences } from "../../../shared/text/sections.js";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";

const PREFIXES = [
  "however, ",
  "but ",
  "and ",
  "so ",
  "ultimately, ",
  "after all, ",
  "in the end, "
];
const SUBJECT_PATTERNS = [
  ["everyone"],
  ["everybody"],
  ["we", "all"],
  ["many", "adults"],
  ["many", "couples"],
  ["many", "families"],
  ["many", "kids"],
  ["many", "parents"],
  ["many", "people"],
  ["many", "of", "us"],
  ["most", "adults"],
  ["most", "couples"],
  ["most", "people"],
  ["most", "of", "us"],
  ["most", "parents"],
  ["most", "families"],
  ["most", "kids"],
  ["for", "many", "adults"],
  ["for", "many", "families"],
  ["for", "many", "parents"],
  ["for", "many", "people"],
  ["for", "most", "people"],
  ["no", "one"],
  ["nobody"]
] as const;
const DESIRE_VERBS = [
  "want",
  "wants",
  "hope",
  "hopes",
  "deserve",
  "deserves",
  "crave",
  "craves",
  "look",
  "looks",
  "reach",
  "reaches",
  "try",
  "tries"
];
const CERTAINTY_VERBS = [
  "assume",
  "assumes",
  "expect",
  "expects",
  "know",
  "knows"
];
const HUMAN_GROUP_SUBJECTS = [
  "adults",
  "children",
  "couples",
  "dads",
  "families",
  "kids",
  "moms",
  "parents",
  "people",
  "students",
  "teachers"
];
const GROUP_BEHAVIOR_GERUNDS = [
  "asking",
  "looking",
  "reaching",
  "trying",
  "waiting",
  "hoping",
  "wondering"
];
const BROAD_GROUP_LEADS = ["many", "most"];

function matchGroupBehavior(words: readonly string[]): string | undefined {
  const [first, subject, third, gerund] = words;

  if (
    first !== undefined &&
    subject !== undefined &&
    third === "keep" &&
    gerund !== undefined &&
    BROAD_GROUP_LEADS.includes(first) &&
    HUMAN_GROUP_SUBJECTS.includes(subject) &&
    GROUP_BEHAVIOR_GERUNDS.includes(gerund)
  ) {
    return `${first} ${subject} keep ${gerund}`;
  }

  return undefined;
}

function matchUniversalizing(sentence: string): string | undefined {
  const words = tokens(cleanSentence(sentence, PREFIXES));
  const group = matchGroupBehavior(words);

  if (group !== undefined) {
    return group;
  }

  for (const subject of SUBJECT_PATTERNS) {
    if (!startsWithWords(words, subject)) {
      continue;
    }

    const window = words.slice(subject.length, subject.length + 4);
    const verb =
      window.find((candidate) => DESIRE_VERBS.includes(candidate)) ??
      window.find((candidate) => CERTAINTY_VERBS.includes(candidate));

    if (verb !== undefined) {
      return `${subject.join(" ")} ${verb}`;
    }
  }

  return undefined;
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        const matched = matchUniversalizing(item.sentence.text);
        if (matched === undefined) {
          continue;
        }

        emitTextlintFinding(context, {
          node: item.paragraph,
          ruleId: "syntactic-patterns:universalizing-claims",
          message: `Universalizing claim found: ${matched}. Replace the broad claim with a bounded claim.`,
          range: {
            start: item.source.originalStartFor(item.sentence.start),
            end: item.source.originalEndFor(item.sentence.end)
          }
        });
      }
    }
  };
};

export default rule;
