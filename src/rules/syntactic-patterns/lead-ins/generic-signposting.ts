import {
  cleanSentence,
  containsAny,
  tokens,
  type SentenceMatch
} from "../../../shared/matchers/prose-patterns.js";
import { oneToOneRule } from "../../private/textlint-rule-builders.js";
import { matchDiscourseEvaluationFrame } from "./private/discourse-evaluation.js";

const PREFIXES = ["however, ", "but ", "and ", "so "];
const IMPORTANT_TO_PATTERNS = [
  "it's important to note",
  "it is important to note",
  "it's important to remember",
  "it is important to remember"
];
const TRANSITION_PATTERNS = ["that being said", "as such"];
const CONSULTATION_PATTERNS = [
  "it's always best to consult",
  "it is always best to consult",
  "it's best to consult",
  "it is best to consult",
  "it's recommended to consult",
  "it is recommended to consult"
];
const NOTE_PATTERNS = ["please note that", "please note"];
const QUESTION_PATTERNS = [
  "the audit move",
  "wrong level of question",
  "the useful question is",
  "the useful move is",
  "the practical move is",
  "the real question is",
  "the better question is",
  "the better operating question is"
];
const ANSWER_PATTERNS = [
  "the lazy conclusion is",
  "the better conclusion",
  "the answer is simple",
  "the answer is straightforward",
  "the grown-up answer is",
  "the practical answer is",
  "the short answer is",
  "the better conclusion is",
  "the useful conclusion is simple"
];
const FRAME_PATTERNS = [
  "the short version",
  "the practical version is",
  "the useful frame",
  "the useful version is",
  "the point is plain enough"
];
const SEQUENCE_PATTERNS = [
  "a simple sequence works well",
  "a simple pattern works well",
  "a simple rule works well"
];
const WHAT_FRAME_TAIL_STARTERS = [
  "boring",
  "clear",
  "consistent",
  "easy",
  "hard",
  "less",
  "making",
  "more",
  "never",
  "not",
  "plain",
  "practice",
  "rarely",
  "small",
  "smaller",
  "simple",
  "straightforward",
  "true",
  "usually"
];
const FRAME_ADJECTIVES = [
  "basic",
  "best",
  "better",
  "biggest",
  "bigger",
  "central",
  "clearest",
  "core",
  "easiest",
  "final",
  "first",
  "hardest",
  "honest",
  "important",
  "main",
  "only",
  "obvious",
  "practical",
  "real",
  "simple",
  "useful"
];
const FRAME_NOUNS = [
  "answer",
  "challenge",
  "conclusion",
  "fact",
  "focus",
  "frame",
  "idea",
  "lesson",
  "move",
  "point",
  "problem",
  "question",
  "result",
  "rule",
  "shift",
  "signal",
  "test",
  "thing",
  "truth",
  "version",
  "way",
  "win"
];
const ABSTRACT_FRAME_VERBS = ["is", "are", "was"];
const POINT_NOUNS = ["goal", "job", "key", "point", "takeaway", "trick"];

function matchModifiedAbstractFrame(
  words: readonly string[]
): string | undefined {
  const [first, second, third, fourth, fifth] = words;

  if (
    first === "the" &&
    second === "result" &&
    third === "worth" &&
    fourth === "caring" &&
    fifth === "about"
  ) {
    return "the-result-worth-caring-about";
  }

  if (first !== "the") {
    return undefined;
  }

  const key = `${second ?? ""}-${third ?? ""}-${fourth ?? ""}`;
  const matches = new Map([
    ["better-move-is", "the-better-move-is"],
    ["bigger-win-is", "the-bigger-win-is"],
    ["useful-move-is", "the-useful-move-is"],
    ["useful-alternative-is", "the-useful-alternative-is"],
    ["useful-alternatives-are", "the-useful-alternatives-are"]
  ]);

  return matches.get(key);
}

function matchEvaluativeFrame(words: readonly string[]): string | undefined {
  const [first, second, third, fourth] = words;

  if (
    first === "the" &&
    second !== undefined &&
    third !== undefined &&
    fourth !== undefined &&
    FRAME_ADJECTIVES.includes(second) &&
    FRAME_NOUNS.includes(third) &&
    ABSTRACT_FRAME_VERBS.includes(fourth)
  ) {
    return `the-${second}-${third}-${fourth}`;
  }

  return undefined;
}

function matchPointIsToFrame(words: readonly string[]): string | undefined {
  const [first, second, third, fourth, fifth] = words;

  if (
    first === "the" &&
    POINT_NOUNS.includes(second ?? "") &&
    third === "is" &&
    fourth === "to" &&
    fifth !== undefined
  ) {
    return `the-${second ?? "point"}-is-to`;
  }

  return undefined;
}

function matchWhatFrame(words: readonly string[]): string | undefined {
  const [first, second, third, fourth] = words;

  if (
    first === "what" &&
    (second === "helps" ||
      second === "matters" ||
      second === "works" ||
      second === "changes") &&
    third === "is" &&
    fourth !== undefined &&
    WHAT_FRAME_TAIL_STARTERS.includes(fourth)
  ) {
    return `what-${second}-is`;
  }

  if (first === "what" && second === "matters" && third === "most") {
    return "what-matters-most";
  }

  if (
    words.length === 3 &&
    first === "what" &&
    (second === "helped" || second === "worked" || second === "changed") &&
    (third === "more" || third === "most")
  ) {
    return `what-${second}-${third}`;
  }

  return undefined;
}

function matchAbstractFrame(text: string): string | undefined {
  const words = tokens(text);
  return (
    matchModifiedAbstractFrame(words) ??
    matchEvaluativeFrame(words) ??
    matchDiscourseEvaluationFrame(words) ??
    matchPointIsToFrame(words) ??
    matchWhatFrame(words)
  );
}

function matchFormulaicContentSetup(text: string): string | undefined {
  if (
    text.startsWith("each ") &&
    text.includes(" has a source") &&
    text.includes(" a reveal") &&
    (text.includes("next move") || text.includes("buyer"))
  ) {
    return "each-piece-has-source-reveal-next-move";
  }

  return undefined;
}

function matchSignposting(sentence: string): SentenceMatch | undefined {
  const stripped = cleanSentence(sentence, PREFIXES);
  const abstract = matchAbstractFrame(stripped);
  const formulaicSetup = matchFormulaicContentSetup(stripped);

  if (abstract !== undefined) {
    return { kind: "abstract-evaluation-frame", signal: abstract };
  }
  if (formulaicSetup !== undefined) {
    return { kind: "formulaic-content-setup", signal: formulaicSetup };
  }

  const checks: readonly (readonly [string, readonly string[]])[] = [
    ["important-to", IMPORTANT_TO_PATTERNS],
    ["transition", TRANSITION_PATTERNS],
    ["consultation-signpost", CONSULTATION_PATTERNS],
    ["note-signpost", NOTE_PATTERNS],
    ["question-frame", QUESTION_PATTERNS],
    ["answer-frame", ANSWER_PATTERNS],
    ["frame-signpost", FRAME_PATTERNS],
    ["sequence-frame", SEQUENCE_PATTERNS]
  ];

  for (const [kind, patterns] of checks) {
    const signal = containsAny(stripped, patterns);
    if (signal !== undefined) {
      return { kind, signal };
    }
  }

  return undefined;
}

const rule = oneToOneRule({
  detect: (unit) => {
    const matched = matchSignposting(unit.text);
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
    `Generic signposting found: ${report.evidence}. Replace the frame with the concrete claim.`,
  ruleId: "syntactic-patterns:generic-signposting",
  unitKind: "sentence"
});

export default rule;
