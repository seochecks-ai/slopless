import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { sectionFirstSentences } from "../../../shared/text/sections.js";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";

const OPENERS = ["the interesting part is", "in the world of"];

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of sectionFirstSentences(node)) {
        const lower = item.sentence.text.toLocaleLowerCase("en");
        const opener = OPENERS.find((phrase) => lower.startsWith(phrase));

        if (opener === undefined) {
          continue;
        }

        emitTextlintFinding(context, {
          node: item.paragraph,
          ruleId: "syntactic-patterns:llm-openers",
          message: `LLM opener found: "${opener}". Start with the concrete claim instead.`,
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
