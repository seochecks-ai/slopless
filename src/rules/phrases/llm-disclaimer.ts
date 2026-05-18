import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import {
  cleanSentence,
  containsAny,
  textStartsWithPattern
} from "../../shared/matchers/prose-patterns.js";
import { allParagraphSentences } from "../../shared/text/sections.js";
import llmDisclaimerExpansions from "./data/llm-disclaimer-expansions.json" with { type: "json" };
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const START_PATTERNS = [
  "as a language model",
  "as an ai language model",
  "as a language model ai",
  "as a large language model",
  "as of my knowledge cutoff",
  "as of my last knowledge update",
  "my knowledge cutoff date is",
  "i do not have access to real-time",
  "i don't have access to real-time",
  "i do not have real-time",
  "i don't have real-time"
];

const CONTAINS_PATTERNS = [
  "as i am an ai language model",
  "as i am a language model",
  "i am an ai language model",
  "i am a language model",
  "knowledge cutoff date is",
  "my knowledge is based on data up to",
  "my training data up until",
  "do not have access to real-time information",
  "don't have access to real-time information",
  "do not have access to real-time data",
  "don't have access to real-time data"
];

const PREFIXES = ["however, ", "but "];

const EXPANDED_START_PATTERNS = [
  ...START_PATTERNS,
  ...llmDisclaimerExpansions.startsWith
];

const EXPANDED_CONTAINS_PATTERNS = [
  ...CONTAINS_PATTERNS,
  ...llmDisclaimerExpansions.contains
];

function matchDisclaimer(sentence: string): string | undefined {
  const stripped = cleanSentence(sentence, PREFIXES);

  return (
    EXPANDED_START_PATTERNS.find((pattern) =>
      textStartsWithPattern(stripped, pattern)
    ) ?? containsAny(stripped, EXPANDED_CONTAINS_PATTERNS)
  );
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        const matched = matchDisclaimer(item.sentence.text);

        if (matched === undefined) {
          continue;
        }

        emitTextlintFinding(context, {
          node: item.paragraph,
          ruleId: "phrases:llm-disclaimer",
          message: `LLM disclaimer found: "${matched}". Remove assistant leakage.`,
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
