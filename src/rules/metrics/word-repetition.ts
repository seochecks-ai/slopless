import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { allParagraphs } from "../../shared/text/sections.js";
import { wordTokens } from "../../shared/text/tokens.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const MAX_REPETITION = 5;

const EXCLUDED_WORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "in",
  "to",
  "and",
  "of",
  "for",
  "that"
]);

function repeatedWords(
  text: string
): Array<readonly [word: string, count: number]> {
  const counts = new Map<string, number>();

  for (const token of wordTokens(text)) {
    const word = token.normalized;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return [...counts]
    .filter(([word, count]) => {
      return (
        word.length >= 4 && !EXCLUDED_WORDS.has(word) && count > MAX_REPETITION
      );
    })
    .sort(([left], [right]) => left.localeCompare(right));
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphs(node)) {
        if (item.source.text.trimStart().startsWith("<")) {
          continue;
        }

        for (const [word, count] of repeatedWords(item.text)) {
          emitTextlintFinding(context, {
            node: item.paragraph,
            ruleId: "metrics:word-repetition",
            message: `Word repeated ${count} times in one paragraph: "${word}". Keep repeated words to ${MAX_REPETITION} or fewer.`,
            range: { start: 0, end: item.source.text.length }
          });
        }
      }
    }
  };
};

export default rule;
