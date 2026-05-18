import type { TextlintRuleModule } from "@textlint/types";
import { wordTokens } from "../../shared/text/tokens.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const LLM_VOCABULARY = new Set([
  "delve",
  "vibrant",
  "landscape",
  "realm",
  "embark",
  "excels",
  "vital",
  "comprehensive",
  "intricate",
  "pivotal",
  "moreover",
  "tapestry"
]);

const rule: TextlintRuleModule = (context) => {
  const { Syntax, getSource } = context;

  return {
    [Syntax.Str](node): void {
      const text = getSource(node);

      for (const token of wordTokens(text)) {
        if (!LLM_VOCABULARY.has(token.normalized)) {
          continue;
        }

        emitTextlintFinding(context, {
          node: node,
          ruleId: "words:llm-vocabulary",
          message: `LLM vocabulary found: "${token.text}". Replace the stock diction with a concrete word.`,
          range: { start: token.start, end: token.end }
        });
      }
    }
  };
};

export default rule;
