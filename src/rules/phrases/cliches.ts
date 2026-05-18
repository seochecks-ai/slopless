import cliches from "./data/cliches.json" with { type: "json" };
import clicheTemplates from "./data/cliche-templates.json" with { type: "json" };
import {
  type PhraseMatch,
  findUnquotedPhraseMatches,
  findUnquotedTokenTemplateMatches
} from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

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

const rule = oneToOneRule({
  detect: (unit) =>
    uniqueMatches([
      ...findUnquotedPhraseMatches(unit.text, cliches),
      ...findUnquotedTokenTemplateMatches(unit.text, clicheTemplates)
    ]).map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "phrases",
  formatMessage: (report) =>
    `Cliche found: "${report.evidence}". Replace it with specific wording.`,
  ignoredAncestorTypes: ["Link", "LinkReference"],
  ruleId: "phrases:cliches",
  unitKind: "str"
});

export default rule;
