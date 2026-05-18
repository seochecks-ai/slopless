import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import redundancyPatterns from "./data/redundancy-patterns.json" with { type: "json" };
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

      for (const match of findUnquotedPhraseMatches(text, redundancyPatterns)) {
        emitTextlintFinding(context, {
          node: node,
          ruleId: "phrases:redundancy",
          message: `Redundant phrase found: "${match.text}". Remove the repeated meaning.`,
          range: { start: match.start, end: match.end }
        });
      }
    }
  };
};

export default rule;
