import type { TxtParentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { findNegationReframes } from "./private/negation-reframe-matcher.js";
import { sourceText } from "../../../shared/text/traverse.js";
import { emitTextlintFinding } from "../../../adapters/textlint/report.js";

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Paragraph](node: TxtParentNode): void {
      const source = sourceText(node);

      for (const match of findNegationReframes(source.text)) {
        emitTextlintFinding(context, {
          node: node,
          ruleId: "syntactic-patterns:negation-reframe",
          message: `Negation reframe found: "${match.text}". Rewrite without the not-X-then-Y construction.`,
          range: {
            start: source.originalStartFor(match.start),
            end: source.originalEndFor(match.end)
          }
        });
      }
    }
  };
};

export default rule;
