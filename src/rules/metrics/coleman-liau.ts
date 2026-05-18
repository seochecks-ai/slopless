import { TextReadability } from "@lunarisapp/readability";
import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { documentText } from "../../shared/text/document.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const MAX_SCORE = 12;

function rounded(score: number): number {
  return Math.round(score * 100) / 100;
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;
  const readability = new TextReadability({ lang: "en_US" });

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      const text = documentText(node);
      if (text.length === 0) {
        return;
      }

      const score = readability.colemanLiauIndex(text);
      if (score <= MAX_SCORE) {
        return;
      }

      emitTextlintFinding(context, {
        node: node,
        ruleId: "metrics:coleman-liau",
        message: `Coleman-Liau is ${rounded(score)}. Keep it at ${MAX_SCORE} or lower.`,
        range: { start: 0, end: 0 }
      });
    }
  };
};

export default rule;
