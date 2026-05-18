import type { TxtParentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import { splitSentences } from "../../shared/text/sentences.js";
import { sourceText } from "../../shared/text/traverse.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

type TimestampMatch = {
  readonly end: number;
  readonly start: number;
  readonly text: string;
};

function isAsciiDigit(character: string | undefined): boolean {
  return character !== undefined && character >= "0" && character <= "9";
}

function isPeriodMarker(
  first: string | undefined,
  second: string | undefined
): boolean {
  if (first === undefined || second === undefined) {
    return false;
  }

  const normalizedFirst = first.toUpperCase();
  return (
    (normalizedFirst === "A" || normalizedFirst === "P") &&
    second.toUpperCase() === "M"
  );
}

function findTimestampMatches(text: string): TimestampMatch[] {
  const matches: TimestampMatch[] = [];
  let index = 0;

  while (index < text.length) {
    if (!isAsciiDigit(text[index])) {
      index += 1;
      continue;
    }

    const start = index;
    while (isAsciiDigit(text[index])) {
      index += 1;
    }

    if (text[index] !== ":") {
      index = start + 1;
      continue;
    }

    index += 1;
    const minuteStart = index;
    while (isAsciiDigit(text[index])) {
      index += 1;
    }

    if (index === minuteStart) {
      index = start + 1;
      continue;
    }

    if (text[index] === " ") {
      index += 1;
    }

    if (!isPeriodMarker(text[index], text[index + 1])) {
      index = start + 1;
      continue;
    }

    const end = index + 2;
    matches.push({
      end,
      start,
      text: text.slice(start, end)
    });
    index = end;
  }

  return matches;
}

function findSentenceTimestampMatches(text: string): TimestampMatch[] {
  const matches: TimestampMatch[] = [];

  for (const sentence of splitSentences(text)) {
    const timestampMatches = findTimestampMatches(sentence.text);
    if (timestampMatches.length === 0) {
      continue;
    }

    const first = timestampMatches[0];
    if (first === undefined) {
      continue;
    }

    matches.push({
      end: sentence.start + first.end,
      start: sentence.start + first.start,
      text: first.text
    });
  }

  return matches;
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;
  const helper = new RuleHelper(context);
  const ignoredParents = [
    Syntax.List,
    Syntax.ListItem,
    Syntax.Table,
    Syntax.TableCell
  ];

  return {
    [Syntax.Paragraph](node: TxtParentNode): void {
      if (helper.isChildNode(node, ignoredParents)) {
        return;
      }

      const source = sourceText(node);

      for (const match of findSentenceTimestampMatches(source.text)) {
        emitTextlintFinding(context, {
          node: node,
          ruleId: "orthography:fake-timestamps",
          message: `Fake timestamp found: "${match.text}". Remove fabricated clock specificity.`,
          range: {
            start: source.originalStartFor(match.start),
            end: source.originalEndFor(match.end)
          }
        });
      }
    }
  };
};

export default rule;
