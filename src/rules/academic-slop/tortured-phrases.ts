import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import torturedPhrases from "./data/tortured-phrases.json" with { type: "json" };
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

      for (const match of findUnquotedPhraseMatches(text, torturedPhrases)) {
        emitTextlintFinding(context, {
          node: node,
          ruleId: "academic-slop:tortured-phrases",
          message: `Tortured phrase found: "${match.text}". Replace it with the standard scientific term.`,
          range: { start: match.start, end: match.end }
        });
      }
    }
  };
};

export default rule;
