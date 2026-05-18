import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import {
  cleanSentence,
  type SentenceMatch
} from "../../../shared/matchers/prose-patterns.js";
import { allParagraphSentences } from "../../../shared/text/sections.js";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";

const PREFIXES = ["however, ", "but ", "and ", "so "];
const EVIDENCE_SUBJECTS = [
  "the evidence",
  "the strongest evidence",
  "the recent evidence",
  "the broader evidence"
];
const RESEARCH_SUBJECTS = [
  "the research",
  "what the research",
  "the broader research",
  "the recent research",
  "the science",
  "the data",
  "studies"
];
const RESEARCHER_SUBJECTS = ["researchers", "scientists"];
const EVIDENCE_PREDICATES = ["is strongest", "is not subtle", "points"];
const RESEARCH_PREDICATES = [
  "backs",
  "does show is",
  "is clear",
  "is not mysterious",
  "points",
  "shows",
  "suggests"
];
const RESEARCHER_PREDICATES = ["keep finding", "keep showing"];
const AUTHORITY_ADVERBS = ["clearly", "consistently", "strongly"];
const PRESTIGE_SUFFIXES = [
  "'s work is famous for a reason",
  "\u2019s work is famous for a reason"
];

function matchesSubjectPredicate(
  text: string,
  subjects: readonly string[],
  predicates: readonly string[]
): boolean {
  return subjects.some((subject) =>
    predicates.some((predicate) => text.startsWith(`${subject} ${predicate}`))
  );
}

function matchesAdverbialSubjectPredicate(
  text: string,
  subjects: readonly string[],
  predicates: readonly string[]
): boolean {
  return subjects.some((subject) =>
    AUTHORITY_ADVERBS.some((adverb) =>
      predicates.some((predicate) =>
        text.startsWith(`${subject} ${adverb} ${predicate}`)
      )
    )
  );
}

function matchAuthorityPadding(sentence: string): SentenceMatch | undefined {
  const stripped = cleanSentence(sentence, PREFIXES);

  if (PRESTIGE_SUFFIXES.some((suffix) => stripped.includes(suffix))) {
    return { kind: "prestige-frame", signal: "work is famous for a reason" };
  }

  if (
    matchesSubjectPredicate(stripped, EVIDENCE_SUBJECTS, EVIDENCE_PREDICATES) ||
    matchesAdverbialSubjectPredicate(
      stripped,
      EVIDENCE_SUBJECTS,
      EVIDENCE_PREDICATES
    ) ||
    stripped.startsWith("the strongest recent evidence points")
  ) {
    return { kind: "evidence-frame", signal: "the evidence" };
  }

  if (
    matchesSubjectPredicate(stripped, RESEARCH_SUBJECTS, RESEARCH_PREDICATES) ||
    matchesAdverbialSubjectPredicate(
      stripped,
      RESEARCH_SUBJECTS,
      RESEARCH_PREDICATES
    ) ||
    stripped.startsWith("the broader research backs") ||
    matchesSubjectPredicate(
      stripped,
      RESEARCHER_SUBJECTS,
      RESEARCHER_PREDICATES
    ) ||
    matchesAdverbialSubjectPredicate(
      stripped,
      RESEARCHER_SUBJECTS,
      RESEARCHER_PREDICATES
    )
  ) {
    return { kind: "research-frame", signal: "the research" };
  }

  return undefined;
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        const matched = matchAuthorityPadding(item.sentence.text);
        if (matched === undefined) {
          continue;
        }

        emitTextlintFinding(context, {
          node: item.paragraph,
          ruleId: "syntactic-patterns:authority-padding",
          message: `Authority padding found: ${matched.signal}. Cite the actual evidence or remove the frame.`,
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
