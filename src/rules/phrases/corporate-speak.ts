import corporateAbstractionPatterns from "./data/corporate-abstraction-patterns.json" with { type: "json" };
import corporateSpeak from "./data/corporate-speak.json" with { type: "json" };
import {
  findUnquotedPhraseMatches,
  findUnquotedTokenTemplateMatches
} from "../../shared/matchers/phrases.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const rule = oneToOneRule({
  detect: (unit) =>
    [
      ...findUnquotedPhraseMatches(unit.text, corporateSpeak),
      ...findUnquotedTokenTemplateMatches(
        unit.text,
        corporateAbstractionPatterns
      )
    ].map((match) => ({
      evidence: match.text,
      label: match.text,
      range: { start: match.start, end: match.end }
    })),
  family: "phrases",
  formatMessage: (report) =>
    `Corporate-speak phrase found: "${report.evidence}". Replace it with specific wording.`,
  ignoredAncestorTypes: ["Link", "LinkReference"],
  ruleId: "phrases:corporate-speak",
  unitKind: "str"
});

export default rule;
