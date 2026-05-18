import {
  cleanSentence,
  containsAny,
  textStartsWithPattern
} from "../../shared/matchers/prose-patterns.js";
import llmDisclaimerExpansions from "./data/llm-disclaimer-expansions.json" with { type: "json" };
import { oneToOneRule } from "../private/textlint-rule-builders.js";

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

const rule = oneToOneRule({
  detect: (unit) => {
    const matched = matchDisclaimer(unit.text);
    if (matched === undefined) {
      return [];
    }

    return [
      {
        evidence: matched,
        label: matched,
        range: { start: 0, end: unit.text.length }
      }
    ];
  },
  family: "phrases",
  formatMessage: (report) =>
    `LLM disclaimer found: "${report.evidence}". Remove assistant leakage.`,
  ruleId: "phrases:llm-disclaimer",
  unitKind: "sentence"
});

export default rule;
