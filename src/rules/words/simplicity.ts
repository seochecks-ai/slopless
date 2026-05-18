import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import simplicityPairs from "./data/simplicity-pairs.json" with { type: "json" };
import { allParagraphSentences } from "../../shared/text/sections.js";
import { wordTokens } from "../../shared/text/tokens.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const SIMPLE_BY_COMPLEX = new Map(
  simplicityPairs.map(([complex, simple]) => [complex, simple])
);

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        for (const token of wordTokens(item.sentence.text)) {
          const simple = SIMPLE_BY_COMPLEX.get(token.normalized);

          if (simple === undefined) {
            continue;
          }

          emitTextlintFinding(context, {
            node: item.paragraph,
            ruleId: "words:simplicity",
            message: `Complex word found: "${token.text}". Use "${simple}" instead.`,
            range: {
              start: item.source.originalStartFor(
                item.sentence.start + token.start
              ),
              end: item.source.originalEndFor(item.sentence.start + token.end)
            }
          });
        }
      }
    }
  };
};

export default rule;
