import { cleanSentence } from "../../../shared/matchers/prose-patterns.js";
import { oneToOneRule } from "../../private/textlint-rule-builders.js";

const PREFIXES = ["and ", "but ", "so "];
const BLAME_NOUNS = ["malice", "shame", "guilt", "blame", "humiliation"];
const GROWTH_NOUNS = ["development", "skill-building", "learning", "practice"];
const CAUSAL_CUES = ["comes from ", "come from ", "stems from ", "stem from "];

function matchesSourceNotBlame(text: string): boolean {
  if (
    !BLAME_NOUNS.some(
      (noun) => text.endsWith(`not ${noun}.`) || text.endsWith(`not ${noun}`)
    )
  ) {
    return false;
  }

  return CAUSAL_CUES.some((cue) => {
    const cueIndex = text.indexOf(cue);
    if (cueIndex < 0) {
      return false;
    }

    const prefix = text.slice(0, cueIndex);
    const after = text.slice(cueIndex + cue.length);
    const growthSegment = after.split(", not ").at(0) ?? "";

    return (
      prefix.split(" ").filter((word) => word.length > 0).length <= 4 &&
      GROWTH_NOUNS.some((noun) => growthSegment.includes(noun))
    );
  });
}

function matchesGrowthInsteadOfBlame(text: string): boolean {
  return (
    text.includes(" instead of ") &&
    text.includes(" as ") &&
    GROWTH_NOUNS.some((noun) => text.includes(`as ${noun}`)) &&
    BLAME_NOUNS.some((noun) => text.includes(`instead of ${noun}`))
  );
}

function matchBlameReframe(sentence: string): string | undefined {
  const stripped = cleanSentence(sentence, PREFIXES);

  if (matchesSourceNotBlame(stripped)) {
    return "source-not-blame";
  }
  if (matchesGrowthInsteadOfBlame(stripped)) {
    return "growth-instead-of-blame";
  }

  return undefined;
}

const rule = oneToOneRule({
  detect: (unit) => {
    const matched = matchBlameReframe(unit.text);
    if (matched === undefined) {
      return [];
    }

    return [
      {
        evidence: matched,
        label: matched,
        range: { start: 0, end: unit.text.length }
      }
    ];
  },
  family: "syntactic-patterns",
  formatMessage: (report) =>
    `Blame reframe found: ${report.evidence}. Replace the moralized contrast with a concrete claim.`,
  ruleId: "syntactic-patterns:blame-reframe",
  unitKind: "sentence"
});

export default rule;
