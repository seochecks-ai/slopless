const ABSTRACT_FRAME_VERBS = ["is", "are", "was", "were"];
const EVALUATION_TAILS = new Set([
  "boring",
  "clear",
  "different",
  "easy",
  "enough",
  "expensive",
  "hard",
  "important",
  "practical",
  "precise",
  "right",
  "simple",
  "straightforward",
  "useful",
  "useless",
  "worse",
  "wrong"
]);
const DISCOURSE_SUBJECT_HEADS = new Set([
  "advice",
  "answer",
  "approach",
  "challenge",
  "choice",
  "claim",
  "conclusion",
  "decision",
  "diagnosis",
  "direction",
  "fact",
  "fix",
  "focus",
  "frame",
  "idea",
  "issue",
  "job",
  "judgment",
  "lesson",
  "method",
  "move",
  "option",
  "plan",
  "point",
  "policy",
  "problem",
  "question",
  "response",
  "result",
  "rule",
  "shift",
  "signal",
  "solution",
  "strategy",
  "tactic",
  "takeaway",
  "test",
  "truth",
  "verdict",
  "version",
  "way",
  "work"
]);

function isDiscourseEvaluationSubject(
  first: string | undefined,
  subject: readonly string[]
): boolean {
  if (first === "this" || first === "that" || first === "it") {
    return true;
  }

  return subject.some((word) => DISCOURSE_SUBJECT_HEADS.has(word));
}

export function matchDiscourseEvaluationFrame(
  words: readonly string[]
): string | undefined {
  const [first] = words;

  if (
    words.length > 8 ||
    !["the", "this", "that", "it"].includes(first ?? "")
  ) {
    return undefined;
  }

  const verbIndex = words.findIndex((word) =>
    ABSTRACT_FRAME_VERBS.includes(word)
  );
  const tail = words.at(-1);
  const subject = verbIndex > 0 ? words.slice(0, verbIndex) : [];

  return verbIndex > 0 &&
    tail !== undefined &&
    EVALUATION_TAILS.has(tail) &&
    isDiscourseEvaluationSubject(first, subject)
    ? `${first ?? "the"}-${words[verbIndex] ?? "is"}-${tail}`
    : undefined;
}
