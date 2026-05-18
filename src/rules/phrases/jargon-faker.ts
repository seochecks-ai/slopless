import { findPhraseMatches } from "../../shared/matchers/phrases.js";
import { wordTokens } from "../../shared/text/tokens.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const JARGON_FAKER_PHRASES = [
  "debug our",
  "debug your",
  "optimizing for",
  "iterating on your"
];

const DEBUG_LITERAL_OBJECTS = new Set([
  "api",
  "app",
  "bug",
  "build",
  "code",
  "crash",
  "deployment",
  "endpoint",
  "error",
  "function",
  "issue",
  "module",
  "package",
  "parser",
  "pipeline",
  "production",
  "query",
  "script",
  "server",
  "service",
  "test",
  "tests"
]);

const OPTIMIZE_LITERAL_TARGETS = new Set([
  "accuracy",
  "cost",
  "efficiency",
  "latency",
  "memory",
  "performance",
  "precision",
  "recall",
  "reliability",
  "speed",
  "throughput"
]);

function nextWordAfter(text: string, end: number): string | undefined {
  return wordTokens(text.slice(end)).at(0)?.normalized;
}

function isLiteralTechnicalUse(
  sentence: string,
  phrase: string,
  end: number
): boolean {
  const nextWord = nextWordAfter(sentence, end);
  if (nextWord === undefined) {
    return false;
  }

  if (phrase === "debug our" || phrase === "debug your") {
    return DEBUG_LITERAL_OBJECTS.has(nextWord);
  }

  if (phrase === "optimizing for") {
    return OPTIMIZE_LITERAL_TARGETS.has(nextWord);
  }

  return false;
}

const rule = oneToOneRule({
  detect: (unit) =>
    findPhraseMatches(unit.text, JARGON_FAKER_PHRASES)
      .filter(
        (match) => !isLiteralTechnicalUse(unit.text, match.phrase, match.end)
      )
      .map((match) => ({
        evidence: match.text,
        label: match.text,
        range: { start: match.start, end: match.end }
      })),
  family: "phrases",
  formatMessage: (report) =>
    `Fake jargon phrase found: "${report.evidence}". Replace the borrowed tech metaphor with plain language.`,
  ruleId: "phrases:jargon-faker",
  unitKind: "sentence"
});

export default rule;
