import { normalizeForMatch } from "../../shared/text/normalize.js";
import { wordTokens } from "../../shared/text/tokens.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

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

const rule = oneToOneRule<RequiredTermsOptions>({
  detect: (unit, options) => {
    const requiredTerms = configuredTerms(options);
    if (requiredTerms.length === 0) {
      return [];
    }

    const terms = presentTerms(unit.text);
    return requiredTerms
      .filter((term) => !terms.has(term))
      .map((term) => ({
        evidence: term,
        label: term,
        range: { start: 0, end: 0 }
      }));
  },
  family: "term-policy",
  formatMessage: (report) =>
    `Required term missing: "${report.evidence}". Add the term or update the policy.`,
  ruleId: "term-policy:required-terms",
  unitKind: "document"
});

export default rule;
