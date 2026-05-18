import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { findPhraseMatches } from "../../shared/matchers/phrases.js";
import { allParagraphSentences } from "../../shared/text/sections.js";
import { wordTokens } from "../../shared/text/tokens.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

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

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        for (const match of findPhraseMatches(
          item.sentence.text,
          JARGON_FAKER_PHRASES
        )) {
          if (
            isLiteralTechnicalUse(item.sentence.text, match.phrase, match.end)
          ) {
            continue;
          }

          emitTextlintFinding(context, {
            node: item.paragraph,
            ruleId: "phrases:jargon-faker",
            message: `Fake jargon phrase found: "${match.text}". Replace the borrowed tech metaphor with plain language.`,
            range: {
              start: item.source.originalStartFor(
                item.sentence.start + match.start
              ),
              end: item.source.originalEndFor(item.sentence.start + match.end)
            }
          });
        }
      }
    }
  };
};

export default rule;
