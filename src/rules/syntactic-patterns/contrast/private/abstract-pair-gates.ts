const ABSTRACT_PAIR_SUBJECTS = new Set([
  "advice",
  "answer",
  "approach",
  "choice",
  "content",
  "decision",
  "diagnosis",
  "fix",
  "panel",
  "plan",
  "prompt",
  "problem",
  "process",
  "question",
  "search",
  "strategy",
  "test",
  "visibility"
]);
const ABSTRACT_PAIR_OBJECTS = new Set([
  "answer",
  "clarity",
  "confidence",
  "decision",
  "direction",
  "feeling",
  "fix",
  "measurement",
  "mood",
  "option",
  "path",
  "plan",
  "response",
  "signal",
  "solution",
  "story",
  "strategy",
  "visibility"
]);

function tokenPairIndex(
  words: readonly string[],
  first: string,
  second: string
): number | undefined {
  const index = words.findIndex(
    (word, wordIndex) => word === first && words[wordIndex + 1] === second
  );

  return index < 0 ? undefined : index;
}

function containsClassifiedToken(
  words: readonly string[],
  classifications: ReadonlySet<string>
): boolean {
  return words.some((word) => classifications.has(word));
}

export function pairHasAbstractSubjectOrObject(
  words: readonly string[],
  first: string,
  second: string
): boolean {
  const pairIndex = tokenPairIndex(words, first, second);
  if (pairIndex === undefined) {
    return false;
  }

  return (
    containsClassifiedToken(
      words.slice(0, pairIndex),
      ABSTRACT_PAIR_SUBJECTS
    ) ||
    containsClassifiedToken(words.slice(pairIndex + 2), ABSTRACT_PAIR_OBJECTS)
  );
}
