import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { allParagraphs } from "../../shared/text/sections.js";
import { splitSentences } from "../../shared/text/sentences.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const MAX_SENTENCES = 6;

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphs(node)) {
        const sentenceCount = splitSentences(item.text).length;

        if (sentenceCount <= MAX_SENTENCES) {
          continue;
        }

        emitTextlintFinding(context, {
          node: item.paragraph,
          ruleId: "metrics:paragraph-length",
          message: `Paragraph has ${sentenceCount} sentences. Keep paragraphs to ${MAX_SENTENCES} sentences or fewer.`,
          range: { start: 0, end: item.source.text.length }
        });
      }
    }
  };
};

export default rule;
