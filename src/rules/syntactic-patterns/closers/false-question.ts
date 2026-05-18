import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { sectionLastSentences } from "../../../shared/text/sections.js";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";

const FALSE_QUESTION_PATTERNS = [
  "isn't that what we all",
  "isn't that the point",
  "isn't that the goal",
  "isn't that what matters",
  "isn't that why"
];

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of sectionLastSentences(node)) {
        const lower = item.sentence.text.toLocaleLowerCase("en");
        const pattern = FALSE_QUESTION_PATTERNS.find((phrase) =>
          lower.includes(phrase)
        );

        if (pattern === undefined || !item.sentence.text.endsWith("?")) {
          continue;
        }

        emitTextlintFinding(context, {
          node: item.paragraph,
          ruleId: "syntactic-patterns:false-question",
          message: `False question found: "${pattern}". Make the claim directly.`,
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
