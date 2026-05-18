import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import prohibitedPhrases from "./data/prohibited-phrases.json" with { type: "json" };
import { findUnquotedPhraseMatches } from "../../shared/matchers/phrases.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const rule: TextlintRuleModule = (context) => {
  const { Syntax, getSource } = context;
  const helper = new RuleHelper(context);
  const ignoredParents = [Syntax.Link, Syntax.LinkReference];

  return {
    [Syntax.Str](node): void {
      if (helper.isChildNode(node, ignoredParents)) {
        return;
      }

      const text = getSource(node);

      for (const match of findUnquotedPhraseMatches(text, prohibitedPhrases)) {
        emitTextlintFinding(context, {
          node: node,
          ruleId: "phrases:prohibited-phrases",
          message: `Prohibited phrase found: "${match.text}". Rewrite without this phrase.`,
          range: { start: match.start, end: match.end }
        });
      }
    }
  };
};

export default rule;
