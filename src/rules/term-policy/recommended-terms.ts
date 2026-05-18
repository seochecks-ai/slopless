import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { documentText } from "../../shared/text/document.js";
import { normalizeForMatch } from "../../shared/text/normalize.js";
import { wordTokens } from "../../shared/text/tokens.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

type RecommendedTermsOptions = {
  readonly allowInflections?: boolean;
  readonly minCount?: number;
  readonly terms?: readonly string[];
};

type RecommendedTermsPolicy = {
  readonly allowInflections: boolean;
  readonly minCount: number;
  readonly terms: readonly string[];
};

const SUFFIXES = [
  "ation",
  "tion",
  "ment",
  "ness",
  "ing",
  "ies",
  "ied",
  "es",
  "ed",
  "er",
  "ly",
  "s"
];

function roughStem(word: string): string {
  for (const suffix of SUFFIXES) {
    if (!word.endsWith(suffix)) {
      continue;
    }

    const stripped = word.slice(0, -suffix.length);
    if (stripped.length >= 3) {
      return stripped;
    }
  }

  return word;
}

function tokenSet(text: string): ReadonlySet<string> {
  return new Set(wordTokens(text).map((token) => token.normalized));
}

function configuredPolicy(
  options: Readonly<RecommendedTermsOptions>
): RecommendedTermsPolicy | undefined {
  const terms =
    options.terms?.map(normalizeForMatch).filter((term) => term.length > 0) ??
    [];
  const minCount = options.minCount ?? 0;

  if (terms.length === 0 || minCount <= 0) {
    return undefined;
  }

  return {
    allowInflections: options.allowInflections === true,
    minCount,
    terms
  };
}

function hasTerm(
  tokens: ReadonlySet<string>,
  term: string,
  allowInflections: boolean
): boolean {
  if (!allowInflections) {
    return tokens.has(term);
  }

  const stem = roughStem(term);
  for (const token of tokens) {
    if (token.startsWith(stem)) {
      return true;
    }
  }

  return false;
}

function countPresentTerms(
  text: string,
  policy: RecommendedTermsPolicy
): number {
  const tokens = tokenSet(text);
  let count = 0;

  for (const term of policy.terms) {
    if (hasTerm(tokens, term, policy.allowInflections)) {
      count += 1;
    }
  }

  return count;
}

const rule: TextlintRuleModule<RecommendedTermsOptions> = (
  context,
  options = {}
) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      const policy = configuredPolicy(options);
      if (policy === undefined) {
        return;
      }

      const count = countPresentTerms(documentText(node), policy);
      if (count >= policy.minCount) {
        return;
      }

      emitTextlintFinding(context, {
        node: node,
        ruleId: "term-policy:recommended-terms",
        message: `Recommended terms present: ${count}. Include at least ${policy.minCount} terms from the policy pool.`,
        range: { start: 0, end: 0 }
      });
    }
  };
};

export default rule;
