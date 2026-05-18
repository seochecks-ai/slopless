import { splitSentences } from "../../shared/text/sentences.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const SMART_QUOTES = new Set(["\u201C", "\u201D", "\u2018", "\u2019"]);

type SmartQuoteMatch = {
  readonly end: number;
  readonly matchedText: string;
  readonly start: number;
};

function findSmartQuotes(text: string): SmartQuoteMatch[] {
  const matches: SmartQuoteMatch[] = [];

  for (const sentence of splitSentences(text)) {
    let matchedText = "";
    let start: number | undefined;
    let end = sentence.start;

    for (let index = sentence.start; index < sentence.end; index += 1) {
      const character = text[index];
      if (character === undefined || !SMART_QUOTES.has(character)) {
        continue;
      }

      start ??= index;
      end = index + character.length;
      matchedText += character;
    }

    if (start !== undefined) {
      matches.push({ end, matchedText, start });
    }
  }

  return matches;
}

const rule = oneToOneRule({
  detect: (unit) =>
    findSmartQuotes(unit.text).map((match) => ({
      evidence: match.matchedText,
      label: match.matchedText,
      range: { start: match.start, end: match.end }
    })),
  family: "orthography",
  formatMessage: (report) =>
    `Smart quotes found: "${report.evidence}". Replace curly quotes with straight quotes.`,
  ruleId: "orthography:smart-quotes",
  unitKind: "paragraph"
});

export default rule;
