import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import cliches from "./data/cliches.json" with { type: "json" };
import clicheTemplates from "./data/cliche-templates.json" with { type: "json" };
import { emitTextlintFinding } from "../../adapters/textlint/report.js";
import {
  type PhraseMatch,
  findUnquotedPhraseMatches,
  findUnquotedTokenTemplateMatches
} from "../../shared/matchers/phrases.js";

function uniqueMatches(matches: readonly PhraseMatch[]): PhraseMatch[] {
  const seen = new Set<string>();

  return matches.filter((match) => {
    const key = `${match.start}:${match.end}:${match.text.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

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

      const matches = uniqueMatches([
        ...findUnquotedPhraseMatches(text, cliches),
        ...findUnquotedTokenTemplateMatches(text, clicheTemplates)
      ]);

      for (const match of matches) {
        emitTextlintFinding(context, {
          node: node,
          ruleId: "phrases:cliches",
          message: `Cliche found: "${match.text}". Replace it with specific wording.`,
          range: { start: match.start, end: match.end }
        });
      }
    }
  };
};

export default rule;
