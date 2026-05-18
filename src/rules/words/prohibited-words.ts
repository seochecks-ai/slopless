import type { TextlintRuleModule } from "@textlint/types";
import prohibitedWords from "./data/prohibited-words.json" with { type: "json" };
import { findPhraseMatches } from "../../shared/matchers/phrases.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const rule: TextlintRuleModule = (context) => {
  const { Syntax, getSource } = context;

  return {
    [Syntax.Str](node): void {
      const text = getSource(node);

      for (const match of findPhraseMatches(text, prohibitedWords)) {
        emitTextlintFinding(context, {
          node: node,
          ruleId: "words:prohibited-words",
          message: `Prohibited word found: "${match.text}". Rewrite without this term.`,
          range: { start: match.start, end: match.end }
        });
      }
    }
  };
};

export default rule;
