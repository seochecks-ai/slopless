import {
  cleanSentence,
  startsWithAnyText,
  tokens,
  type SentenceMatch
} from "../../../shared/matchers/prose-patterns.js";
import { oneToOneRule } from "../../private/textlint-rule-builders.js";

const PREFIXES = ["and ", "but ", "so "];
const LESSON_SUMMARY_PATTERNS = [
  "the biggest lesson was simple",
  "the practical lesson for me was simple",
  "the practical lesson was simple"
];
const FIX_CUES = [
  "plain",
  "boring",
  "simple",
  "small",
  "smaller",
  "not heroic",
  "not dramatic",
  "usually smaller than people want"
];
const SUMMARY_SUBJECTS = [
  "answer",
  "fix",
  "lesson",
  "move",
  "strategy",
  "trick"
];

function matchSummaryFrame(text: string): string | undefined {
  const words = tokens(text);
  const [first, second, third, fourth] = words;

  if (
    first === "the" &&
    second !== undefined &&
    third === "is" &&
    fourth !== undefined &&
    SUMMARY_SUBJECTS.includes(second) &&
    FIX_CUES.includes(fourth)
  ) {
    return `the-${second}-is-${fourth}`;
  }

  return undefined;
}

function matchLessonFraming(sentence: string): SentenceMatch | undefined {
  const stripped = cleanSentence(sentence, PREFIXES);
  const lesson = startsWithAnyText(stripped, LESSON_SUMMARY_PATTERNS);

  if (lesson !== undefined) {
    return { kind: "lesson-summary", signal: lesson };
  }

  const summary = matchSummaryFrame(stripped);
  if (summary !== undefined) {
    return { kind: "summary-frame", signal: summary };
  }

  if (!stripped.startsWith("the fix is ")) {
    return undefined;
  }

  const cue = FIX_CUES.find((item) =>
    stripped.startsWith(`the fix is ${item}`)
  );
  return cue === undefined ? undefined : { kind: "fix-wrapper", signal: cue };
}

const rule = oneToOneRule({
  detect: (unit) => {
    const matched = matchLessonFraming(unit.text);
    if (matched === undefined) {
      return [];
    }

    return [
      {
        evidence: matched.signal,
        label: matched.kind,
        range: { start: 0, end: unit.text.length }
      }
    ];
  },
  family: "syntactic-patterns",
  formatMessage: (report) =>
    `Lesson framing found: ${report.evidence}. Replace the wrapper with the lesson.`,
  ruleId: "syntactic-patterns:lesson-framing",
  unitKind: "sentence"
});

export default rule;
