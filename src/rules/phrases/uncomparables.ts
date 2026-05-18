import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import uncomparables from "./data/uncomparables.json" with { type: "json" };
import {
  findUnquotedPhraseMatches,
  type PhraseMatch
} from "../../shared/matchers/phrases.js";
import { normalizeForMatch } from "../../shared/text/normalize.js";
import { wordTokens } from "../../shared/text/tokens.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const EXCEPTION_SEPARATOR = "\u0000";

function exceptionKey(comparator: string, adjective: string): string {
  return `${normalizeForMatch(comparator)}${EXCEPTION_SEPARATOR}${normalizeForMatch(adjective)}`;
}

function exceptionKeys(): readonly string[] {
  const keys: string[] = [];

  for (const exception of uncomparables.exceptions) {
    const comparator = exception[0];
    const adjective = exception[1];

    if (comparator === undefined || adjective === undefined) {
      continue;
    }

    keys.push(exceptionKey(comparator, adjective));
  }

  return keys;
}

const EXCEPTION_KEYS = new Set(exceptionKeys());
EXCEPTION_KEYS.add(exceptionKey("least", "possible"));

function uncomparablePhrases(): readonly string[] {
  const phrases: string[] = [];

  for (const comparator of [
    ...uncomparables.comparators,
    ...uncomparables.fancyComparators
  ]) {
    for (const adjective of uncomparables.adjectives) {
      if (EXCEPTION_KEYS.has(exceptionKey(comparator, adjective))) {
        continue;
      }

      phrases.push(`${comparator} ${adjective}`);
    }
  }

  return phrases;
}

const UNCOMPARABLE_PHRASES = uncomparablePhrases();
const FANCY_COMPARATORS = new Set(
  uncomparables.fancyComparators.map((comparator) =>
    normalizeForMatch(comparator)
  )
);

function startsWithFancyComparator(phrase: string): boolean {
  const firstToken = wordTokens(phrase)[0];

  return (
    firstToken !== undefined && FANCY_COMPARATORS.has(firstToken.normalized)
  );
}

function previousTokenIsAt(
  text: string,
  match: Pick<PhraseMatch, "start">
): boolean {
  const previousTokens = wordTokens(text.slice(0, match.start));
  const previousToken = previousTokens.at(-1);

  return previousToken?.normalized === "at";
}

function shouldReport(text: string, match: PhraseMatch): boolean {
  if (!startsWithFancyComparator(match.phrase)) {
    return true;
  }

  return !previousTokenIsAt(text, match);
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

      for (const match of findUnquotedPhraseMatches(
        text,
        UNCOMPARABLE_PHRASES
      )) {
        if (!shouldReport(text, match)) {
          continue;
        }

        emitTextlintFinding(context, {
          node: node,
          ruleId: "phrases:uncomparables",
          message: `Uncomparable phrase found: "${match.text}". Remove the modifier.`,
          range: { start: match.start, end: match.end }
        });
      }
    }
  };
};

export default rule;
