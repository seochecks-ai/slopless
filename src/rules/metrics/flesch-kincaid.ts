import { TextReadability } from "@lunarisapp/readability";
import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { documentText } from "../../shared/text/document.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const MIN_SCORE = 61;

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

      const score = readability.fleschReadingEase(text);
      if (score >= MIN_SCORE) {
        return;
      }

      emitTextlintFinding(context, {
        node: node,
        ruleId: "metrics:flesch-kincaid",
        message: `Flesch Reading Ease is ${rounded(score)}. Keep it at ${MIN_SCORE} or higher.`,
        range: { start: 0, end: 0 }
      });
    }
  };
};

export default rule;
