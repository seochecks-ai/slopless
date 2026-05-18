import { defineTextlintRule } from "../../../adapters/textlint/rule.js";
import { sentenceUnits } from "../../../adapters/textlint/units.js";
import {
  cleanSentence,
  containsAny,
  tokens,
  type SentenceMatch
} from "../../../shared/matchers/prose-patterns.js";

const PREFIXES = [
  "ultimately, ",
  "overall, ",
  "in the end, ",
  "in short, ",
  "and ",
  "but "
];
const IMPORTANCE_CUES = ["most important", "single most important", "deepest"];
const SUMMARY_NOUNS = ["insight", "reason", "idea", "step"];
const AUTHORITY_CLOSE_PATTERNS = [
  "the research is clear",
  "science is clear",
  "decades of research",
  "research leaves no doubt"
];
const ACCEPTANCE_CLOSE_PATTERNS = [
  "not something you have to accept as normal",
  "not something you need to accept as normal",
  "is not a luxury"
];
const RESPONSE_CLOSE_PATTERNS = ["the practical response is plain"];
const BASIC_RULE_SIMPLE_PATTERN = "the basic rule is simple";
const COMPRESSION_CLOSE_PATTERNS = [
  "the whole trick",
  "the core fact",
  "the rest is detail"
];
const FORMULA_SUBJECTS = ["that", "this", "it"];
const FORMULA_NOUNS = [
  "answer",
  "fact",
  "frame",
  "game",
  "idea",
  "lesson",
  "move",
  "point",
  "rule",
  "test",
  "thing",
  "trick"
];

function matchInsightClose(text: string): string | undefined {
  if (
    IMPORTANCE_CUES.some((cue) => text.includes(cue)) &&
    SUMMARY_NOUNS.some((noun) => text.includes(noun))
  ) {
    return "importance+summary-noun";
  }

  return undefined;
}

function matchResponseClose(text: string): string | undefined {
  const response = containsAny(text, RESPONSE_CLOSE_PATTERNS);
  if (response !== undefined) {
    return response;
  }

  const tail = text.slice(BASIC_RULE_SIMPLE_PATTERN.length).trim();
  return text.startsWith(BASIC_RULE_SIMPLE_PATTERN) &&
    (tail.length === 0 || tail === ".")
    ? BASIC_RULE_SIMPLE_PATTERN
    : undefined;
}

function matchFormulaClose(text: string): string | undefined {
  const words = tokens(text);

  if (words.length > 8) {
    return undefined;
  }

  const [first, second, third, fourth] = words;
  if (
    first !== undefined &&
    FORMULA_SUBJECTS.includes(first) &&
    second === "is" &&
    third === "the" &&
    fourth !== undefined &&
    FORMULA_NOUNS.includes(fourth)
  ) {
    return `${first}-is-the-${fourth}`;
  }

  return undefined;
}

function matchConclusion(
  sentence: string,
  isTail: boolean
): SentenceMatch | undefined {
  const stripped = cleanSentence(sentence, PREFIXES);

  if (isTail) {
    const formula = matchFormulaClose(stripped);
    if (formula !== undefined) {
      return { kind: "formula-close", signal: formula };
    }

    const insight = matchInsightClose(stripped);
    if (insight !== undefined) {
      return { kind: "insight-close", signal: insight };
    }

    const authority = containsAny(stripped, AUTHORITY_CLOSE_PATTERNS);
    if (authority !== undefined) {
      return { kind: "authority-close", signal: authority };
    }

    const acceptance = containsAny(stripped, ACCEPTANCE_CLOSE_PATTERNS);
    if (acceptance !== undefined) {
      return { kind: "acceptance-close", signal: acceptance };
    }
  }

  const response = matchResponseClose(stripped);
  if (response !== undefined) {
    return { kind: "response-close", signal: response };
  }

  const compression = containsAny(stripped, COMPRESSION_CLOSE_PATTERNS);
  return compression === undefined
    ? undefined
    : { kind: "compression-close", signal: compression };
}

const rule = defineTextlintRule({
  detector: {
    detect: ({ units }) => {
      const tailStart = Math.max(units.length - 3, 0);
      return units.flatMap((unit, index) => {
        const matched = matchConclusion(unit.text, index >= tailStart);
        if (matched === undefined) {
          return [];
        }

        return [
          {
            evidence: matched.signal,
            label: matched.kind,
            range: { start: 0, end: unit.text.length },
            ruleId: "syntactic-patterns:boilerplate-conclusion" as const,
            unitId: unit.id
          }
        ];
      });
    },
    family: "syntactic-patterns",
    id: "syntactic-patterns:boilerplate-conclusion"
  },
  formatMessage: (report) =>
    `Boilerplate conclusion found: ${report.evidence}. Replace the closer with a specific ending.`,
  reportPolicy: { kind: "one-to-one" },
  units: (document) => sentenceUnits(document)
});

export default rule;
