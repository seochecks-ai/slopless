import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import redundancyPatterns from "./data/redundancy-patterns.json" with { type: "json" };
import { findUnquotedPhraseMatches } from "../../shared/matchers/phrases.js";

const rule: TextlintRuleModule = (context) => {
  const { Syntax, RuleError, getSource, locator, report } = context;
  const helper = new RuleHelper(context);
  const ignoredParents = [Syntax.Link, Syntax.LinkReference];

  return {
    [Syntax.Str](node): void {
      if (helper.isChildNode(node, ignoredParents)) {
        return;
      }

      const text = getSource(node);

      for (const match of findUnquotedPhraseMatches(text, redundancyPatterns)) {
        report(
          node,
          new RuleError(
            `Redundant phrase found: "${match.text}". Remove the repeated meaning.`,
            {
              padding: locator.range([match.start, match.end])
            }
          )
        );
      }
    }
  };
};

export default rule;
