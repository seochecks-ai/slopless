import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { documentText } from "../../shared/text/document.js";
import { normalizeForMatch } from "../../shared/text/normalize.js";
import { wordTokens } from "../../shared/text/tokens.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

type RequiredTermsOptions = {
  readonly terms?: readonly string[];
};

function presentTerms(text: string): ReadonlySet<string> {
  return new Set(wordTokens(text).map((token) => token.normalized));
}

function configuredTerms(
  options: Readonly<RequiredTermsOptions>
): readonly string[] {
  return (
    options.terms?.map(normalizeForMatch).filter((term) => term.length > 0) ??
    []
  );
}

const rule: TextlintRuleModule<RequiredTermsOptions> = (
  context,
  options = {}
) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      const requiredTerms = configuredTerms(options);
      if (requiredTerms.length === 0) {
        return;
      }

      const terms = presentTerms(documentText(node));

      for (const term of requiredTerms) {
        if (terms.has(term)) {
          continue;
        }

        emitTextlintFinding(context, {
          node: node,
          ruleId: "term-policy:required-terms",
          message: `Required term missing: "${term}". Add the term or update the policy.`,
          range: { start: 0, end: 0 }
        });
      }
    }
  };
};

export default rule;
