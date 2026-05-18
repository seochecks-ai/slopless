import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { documentMetrics } from "../../shared/text/document.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const MAX_WORDS = 24;

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      const metrics = documentMetrics(node);
      if (metrics.sentenceCount === 0) {
        return;
      }

      const average = Math.floor(metrics.wordCount / metrics.sentenceCount);
      if (average <= MAX_WORDS) {
        return;
      }

      emitTextlintFinding(context, {
        node: node,
        ruleId: "metrics:avg-sentence-length",
        message: `Average sentence length is ${average} words. Keep it at ${MAX_WORDS} or fewer.`,
        range: { start: 0, end: 0 }
      });
    }
  };
};

export default rule;
