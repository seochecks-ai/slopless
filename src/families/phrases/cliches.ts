import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import cliches from "./data/cliches.json" with { type: "json" };
import clicheTemplates from "./data/cliche-templates.json" with { type: "json" };
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
  const { Syntax, RuleError, getSource, locator, report } = context;
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
        report(
          node,
          new RuleError(
            `Cliche found: "${match.text}". Replace it with specific wording.`,
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
