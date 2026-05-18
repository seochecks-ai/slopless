import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import {
  cleanSentence,
  startsWithAnyText,
  tokens,
  trimTerminalPunctuation,
  type SentenceMatch
} from "../../../shared/matchers/prose-patterns.js";
import { allParagraphSentences } from "../../../shared/text/sections.js";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";

const PREFIXES = ["and ", "but ", "so "];
const OBSERVER_PATTERNS = [
  "you see it everywhere",
  "you see it after almost every",
  "you can watch it happen in real time",
  "you can tell the difference quickly"
];
const READER_ADDRESS_PATTERNS = ["if this hits home"];
const STUCK_PATTERNS = ["this is where people get stuck"];
const WHERE_BRIDGE_PATTERNS = [
  "that is where the confusion slips in",
  "that is where a lot of work gets lost",
  "that is where the guilt starts",
  "that is where the real progress lives",
  "that is where a lot of the misunderstanding begins",
  "that is where culture becomes visible"
];
const WHERE_SUBJECTS = ["people", "parents", "kids", "children", "couples"];
const WHERE_VERBS = ["get", "go", "miss", "overreach", "stumble"];
const WHERE_COMPLEMENTS = ["stuck", "wrong", "it", "there"];
const SEE_PATTERNS = [
  "you see this when",
  "you see it when",
  "you see this in",
  "you see it in",
  "you can see this when",
  "you can see it when"
];

function exactStart(
  text: string,
  patterns: readonly string[]
): string | undefined {
  const matched = startsWithAnyText(text, patterns);
  return matched !== undefined && text === matched ? matched : undefined;
}

function matchObserverGuidance(sentence: string): SentenceMatch | undefined {
  const stripped = cleanSentence(sentence, PREFIXES);
  const trimmed = trimTerminalPunctuation(stripped);
  const observer = exactStart(trimmed, OBSERVER_PATTERNS);

  if (observer !== undefined) {
    return { kind: "observer-frame", signal: observer };
  }

  const reader = startsWithAnyText(stripped, READER_ADDRESS_PATTERNS);
  if (reader !== undefined) {
    return { kind: "reader-address", signal: reader };
  }

  const stuck = exactStart(trimmed, STUCK_PATTERNS);
  if (stuck !== undefined) {
    return { kind: "stuck-frame", signal: stuck };
  }

  const bridge = exactStart(trimmed, WHERE_BRIDGE_PATTERNS);
  if (bridge !== undefined) {
    return { kind: "where-bridge", signal: bridge };
  }

  const see = startsWithAnyText(stripped, SEE_PATTERNS);
  if (see !== undefined) {
    return { kind: "observer-frame", signal: see };
  }

  const words = tokens(trimmed);
  const [first, second, third, fourth, fifth, sixth] = words;
  if (
    (first === "this" || first === "that") &&
    second === "is" &&
    third === "where" &&
    fourth !== undefined &&
    fifth !== undefined &&
    WHERE_SUBJECTS.includes(fourth) &&
    WHERE_VERBS.includes(fifth) &&
    (sixth === undefined || WHERE_COMPLEMENTS.includes(sixth))
  ) {
    return {
      kind: "where-bridge",
      signal: `${first}-is-where-${fourth}-${fifth}`
    };
  }

  return undefined;
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        const matched = matchObserverGuidance(item.sentence.text);
        if (matched === undefined) {
          continue;
        }

        emitTextlintFinding(context, {
          node: item.paragraph,
          ruleId: "syntactic-patterns:observer-guidance",
          message: `Observer guidance found: ${matched.signal}. Replace the bridge with concrete evidence.`,
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
