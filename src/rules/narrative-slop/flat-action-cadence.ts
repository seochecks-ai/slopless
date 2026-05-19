import {
  splitSentences,
  type SplitSentence
} from "../../shared/text/sentences.js";
import { type Token, wordTokens } from "../../shared/text/tokens.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

type CadenceSentence = {
  readonly actionKind: "linking" | "weak-action";
  readonly sentence: SplitSentence;
  readonly subjectKind: "article-noun" | "name" | "possessive" | "pronoun";
  readonly verb: string;
};

type CadenceRun = {
  readonly end: number;
  readonly sentences: readonly CadenceSentence[];
  readonly start: number;
};

const MAX_SIMPLE_SENTENCE_TOKENS = 14;
const MIN_RUN_LENGTH = 3;
const CLAUSE_CONNECTORS = new Set(["and", "then"]);

function wordSet(words: string): ReadonlySet<string> {
  return new Set(words.split(" "));
}

const SUBORDINATING_MARKERS = wordSet(
  "after although as because before if once since though unless until when whenever where whereas while"
);
const PRONOUN_SUBJECTS = wordSet("he it she they we you");
const POSSESSIVE_SUBJECT_OPENERS = wordSet("her his its my our their your");
const BODY_AND_CAMERA_NOUNS = wordSet(
  "arm arms body breath chest ear ears eye eyes face finger fingers foot feet hand hands head heart leg legs mouth paw paws posture shoulder shoulders stomach tail voice"
);
const WEAK_ACTION_VERBS = wordSet(
  "angled angle blink blinked climb climbed cross crossed crouch crouched flatten flattened hear heard gaze gazed glance glanced hang hung listen listened look looked lean leaned nod nodded observe observed pick picked pull pulled rested reach reached run ran shift shifted sit sat stand stood stare stared step stepped stop stopped turn turned twitch twitched tie tied wait waited walk walked watch watched"
);
const LINKING_VERBS = wordSet(
  "am are be been being felt is looked seemed was were"
);
const SENSORIAL_COMPLEMENTS = wordSet(
  "cold dark heavy haze blur fog low quiet sharp still tight tired"
);

function tokenAt(tokens: readonly Token[], index: number): Token | undefined {
  return tokens[index];
}

function hasSubordinatingMarker(tokens: readonly Token[]): boolean {
  return tokens.some((token) => SUBORDINATING_MARKERS.has(token.normalized));
}

function isCapitalized(token: Token): boolean {
  const first = token.text[0];
  if (first === undefined) {
    return false;
  }

  return (
    first.toLocaleUpperCase("en") === first &&
    first.toLocaleLowerCase("en") !== first
  );
}

function subjectKind(
  tokens: readonly Token[]
): CadenceSentence["subjectKind"] | undefined {
  const first = tokenAt(tokens, 0);
  if (first === undefined) {
    return undefined;
  }

  if (PRONOUN_SUBJECTS.has(first.normalized)) {
    return "pronoun";
  }

  if (POSSESSIVE_SUBJECT_OPENERS.has(first.normalized)) {
    return tokens.some((token) => BODY_AND_CAMERA_NOUNS.has(token.normalized))
      ? "possessive"
      : undefined;
  }

  if (first.normalized === "the") {
    return "article-noun";
  }

  if (isCapitalized(first)) {
    return "name";
  }

  return undefined;
}

function negatedActionVerb(tokens: readonly Token[]): string | undefined {
  const auxiliary = tokenAt(tokens, 1);
  const negation = tokenAt(tokens, 2);
  const verb = tokenAt(tokens, 3);
  if (
    auxiliary?.normalized !== "did" ||
    negation?.normalized !== "not" ||
    verb === undefined ||
    !WEAK_ACTION_VERBS.has(verb.normalized)
  ) {
    return undefined;
  }

  return verb.normalized;
}

function firstWeakActionVerb(tokens: readonly Token[]): string | undefined {
  const negated = negatedActionVerb(tokens);
  if (negated !== undefined) {
    return negated;
  }

  for (const token of tokens.slice(1, 8)) {
    if (WEAK_ACTION_VERBS.has(token.normalized)) {
      return token.normalized;
    }
  }

  return undefined;
}

function hasSensorialComplement(tokens: readonly Token[]): boolean {
  return tokens.some((token) => SENSORIAL_COMPLEMENTS.has(token.normalized));
}

function trimLeadingConnectors(tokens: readonly Token[]): readonly Token[] {
  let index = 0;
  while (
    index < tokens.length &&
    CLAUSE_CONNECTORS.has(tokens[index]?.normalized ?? "")
  ) {
    index += 1;
  }

  return tokens.slice(index);
}

function firstLinkingVerb(tokens: readonly Token[]): string | undefined {
  for (const token of tokens.slice(1, 8)) {
    if (LINKING_VERBS.has(token.normalized)) {
      return token.normalized;
    }
  }

  return undefined;
}

function classifySentence(
  sentence: SplitSentence
): CadenceSentence | undefined {
  const tokens = trimLeadingConnectors(wordTokens(sentence.text));
  if (tokens.length < 3 || tokens.length > MAX_SIMPLE_SENTENCE_TOKENS) {
    return undefined;
  }

  if (hasSubordinatingMarker(tokens)) {
    return undefined;
  }

  const kind = subjectKind(tokens);
  if (kind === undefined) {
    return undefined;
  }

  const weakActionVerb = firstWeakActionVerb(tokens);
  if (weakActionVerb !== undefined) {
    return {
      actionKind: "weak-action",
      sentence,
      subjectKind: kind,
      verb: weakActionVerb
    };
  }

  const linkingVerb = firstLinkingVerb(tokens);
  if (linkingVerb !== undefined && hasSensorialComplement(tokens)) {
    return {
      actionKind: "linking",
      sentence,
      subjectKind: kind,
      verb: linkingVerb
    };
  }

  return undefined;
}

function splitCommaClauses(sentence: SplitSentence): readonly SplitSentence[] {
  const clauses: SplitSentence[] = [];
  let start = 0;

  for (let index = 0; index < sentence.text.length; index += 1) {
    if (sentence.text[index] !== ",") {
      continue;
    }

    const text = sentence.text.slice(start, index).trim();
    if (text.length > 0) {
      const leading = firstNonWhitespaceIndex(sentence.text, start, index);
      clauses.push({
        end: sentence.start + index,
        start: sentence.start + leading,
        text
      });
    }
    start = index + 1;
  }

  const text = sentence.text.slice(start).trim();
  if (text.length > 0) {
    const leading = firstNonWhitespaceIndex(
      sentence.text,
      start,
      sentence.text.length
    );
    clauses.push({
      end: sentence.end,
      start: sentence.start + leading,
      text
    });
  }

  return clauses;
}

function firstNonWhitespaceIndex(
  text: string,
  start: number,
  end: number
): number {
  for (let index = start; index < end; index += 1) {
    if (text[index]?.trim() !== "") {
      return index;
    }
  }

  return start;
}

function isCadenceRun(sentences: readonly CadenceSentence[]): boolean {
  const weakActionCount = sentences.filter(
    (sentence) => sentence.actionKind === "weak-action"
  ).length;

  return weakActionCount >= 2;
}

function findFlatActionRuns(text: string): CadenceRun[] {
  const sentences = splitSentences(text);
  const runs: CadenceRun[] = [];
  let current: CadenceSentence[] = [];

  for (const sentence of sentences) {
    const cadenceSentence = classifySentence(sentence);
    if (cadenceSentence === undefined) {
      if (current.length >= MIN_RUN_LENGTH && isCadenceRun(current)) {
        const first = current[0];
        const last = current.at(-1);
        if (first !== undefined && last !== undefined) {
          runs.push({
            end: last.sentence.end,
            sentences: current,
            start: first.sentence.start
          });
        }
      }
      current = [];
      continue;
    }

    current.push(cadenceSentence);
  }

  if (current.length >= MIN_RUN_LENGTH && isCadenceRun(current)) {
    const first = current[0];
    const last = current.at(-1);
    if (first !== undefined && last !== undefined) {
      runs.push({
        end: last.sentence.end,
        sentences: current,
        start: first.sentence.start
      });
    }
  }

  return runs;
}

function findFlatActionClauseRuns(text: string): CadenceRun[] {
  return splitSentences(text).flatMap((sentence) =>
    findFlatActionRunsFromSentences(splitCommaClauses(sentence))
  );
}

function findFlatActionRunsFromSentences(
  sentences: readonly SplitSentence[]
): CadenceRun[] {
  const runs: CadenceRun[] = [];
  let current: CadenceSentence[] = [];

  for (const sentence of sentences) {
    const cadenceSentence = classifySentence(sentence);
    if (cadenceSentence === undefined) {
      if (current.length >= MIN_RUN_LENGTH && isCadenceRun(current)) {
        const first = current[0];
        const last = current.at(-1);
        if (first !== undefined && last !== undefined) {
          runs.push({
            end: last.sentence.end,
            sentences: current,
            start: first.sentence.start
          });
        }
      }
      current = [];
      continue;
    }

    current.push(cadenceSentence);
  }

  if (current.length >= MIN_RUN_LENGTH && isCadenceRun(current)) {
    const first = current[0];
    const last = current.at(-1);
    if (first !== undefined && last !== undefined) {
      runs.push({
        end: last.sentence.end,
        sentences: current,
        start: first.sentence.start
      });
    }
  }

  return runs;
}

const rule = oneToOneRule({
  detect: (unit) => {
    const match =
      findFlatActionRuns(unit.text)[0] ??
      findFlatActionClauseRuns(unit.text)[0];
    if (match === undefined) {
      return [];
    }

    const verbs = [
      ...new Set(match.sentences.map((sentence) => sentence.verb))
    ].join(", ");

    return [
      {
        data: { count: match.sentences.length, verbs },
        evidence: verbs,
        label: "flat action cadence",
        range: { start: match.start, end: match.end }
      }
    ];
  },
  family: "narrative-slop",
  formatMessage: (report) =>
    `Flat action cadence: ${report.detections[0]?.data?.["count"]} adjacent short simple sentences use subject-action beats (${report.detections[0]?.data?.["verbs"]}). Vary the rhythm or add causal/sensory development.`,
  ruleId: "narrative-slop:flat-action-cadence",
  unitKind: "paragraph"
});

export default rule;
