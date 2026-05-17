import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import {
  cleanSentence,
  containsAny,
  type SentenceMatch
} from "../../../shared/matchers/prose-patterns.js";
import { allParagraphSentences } from "../../../shared/text/sections.js";
import responseWrapperPatterns from "./data/response-wrapper-patterns.json" with { type: "json" };

const PREFIXES = ["however, ", "but ", "that being said, ", "as such, "];
const SUBJECTS = ["i"];
const CAPABILITY_AUXILIARIES = ["can"];
const LIMITATION_AUXILIARIES = ["cannot", "can't", "do not", "don't"];
const ABILITY_LIMITATION_PREFIXES = [
  "do not have the ability to",
  "don't have the ability to"
];
const CAPABILITY_ACTIONS = ["provide", "offer", "share", "give"];
const INFORMATION_OBJECTS = [
  "general information",
  "general guidance",
  "general suggestions",
  "some general suggestions",
  "general advice"
];
const LIMITATION_ACTIONS = ["provide", "give", "offer"];
const DIAGNOSIS_ACTIONS = ["diagnose"];
const INFORMATION_LIMITATION_OBJECTS = [
  "information",
  "up-to-date information",
  "most up-to-date information",
  "real-time information",
  "specific information"
];
const ADVICE_LIMITATION_OBJECTS = [
  "medical advice",
  "specific medical advice",
  "specific advice",
  "personalized advice"
];
const MEDICAL_EXPERTISE_OBJECTS = ["medical expertise"];
const DIAGNOSIS_LIMITATION_OBJECTS = [
  "provide a diagnosis",
  "diagnosis",
  "diagnose",
  "treatment plan"
];

function startsWithSourcePattern(text: string): string | undefined {
  return responseWrapperPatterns.startsWith.find((pattern) => {
    if (!text.startsWith(pattern)) {
      return false;
    }

    const next = text.at(pattern.length);
    return (
      next === undefined ||
      next === " " ||
      next === "," ||
      next === "." ||
      next === ":" ||
      next === ";" ||
      next === "!" ||
      next === "?"
    );
  });
}

function matchesSubjectAuxActionObjects(
  text: string,
  subjects: readonly string[],
  auxiliaries: readonly string[],
  actions: readonly string[],
  objects: readonly string[]
): boolean {
  return subjects.some((subject) =>
    auxiliaries.some((auxiliary) =>
      actions.some((action) => {
        const prefix = `${subject} ${auxiliary} ${action} `;
        return (
          text.startsWith(prefix) &&
          objects.some((object) => text.includes(object))
        );
      })
    )
  );
}

function matchesSubjectAuxObjects(
  text: string,
  subjects: readonly string[],
  auxiliaries: readonly string[],
  objects: readonly string[]
): boolean {
  return subjects.some((subject) =>
    auxiliaries.some((auxiliary) => {
      const prefix = `${subject} ${auxiliary} `;
      return (
        text.startsWith(prefix) &&
        objects.some((object) => text.includes(object))
      );
    })
  );
}

function matchesSubjectPrefixActionObjects(
  text: string,
  subjects: readonly string[],
  prefixes: readonly string[],
  actions: readonly string[],
  objects: readonly string[]
): boolean {
  return subjects.some((subject) =>
    prefixes.some((prefix) =>
      actions.some((action) => {
        const start = `${subject} ${prefix} ${action} `;
        return (
          text.startsWith(start) &&
          objects.some((object) => text.includes(object))
        );
      })
    )
  );
}

function matchResponseWrapper(sentence: string): SentenceMatch | undefined {
  const stripped = cleanSentence(sentence, PREFIXES);
  const startPattern = startsWithSourcePattern(stripped);
  if (startPattern !== undefined) {
    return { kind: "chat-scaffold", signal: startPattern };
  }

  const containedPattern = containsAny(
    stripped,
    responseWrapperPatterns.contains
  );
  if (containedPattern !== undefined) {
    return { kind: "chat-followup", signal: containedPattern };
  }

  if (
    matchesSubjectAuxActionObjects(
      stripped,
      SUBJECTS,
      CAPABILITY_AUXILIARIES,
      CAPABILITY_ACTIONS,
      INFORMATION_OBJECTS
    )
  ) {
    return { kind: "information-wrapper", signal: "capability+info-object" };
  }

  if (
    matchesSubjectAuxActionObjects(
      stripped,
      SUBJECTS,
      LIMITATION_AUXILIARIES,
      LIMITATION_ACTIONS,
      INFORMATION_LIMITATION_OBJECTS
    )
  ) {
    return { kind: "information-wrapper", signal: "limitation+info-object" };
  }

  if (
    matchesSubjectAuxObjects(
      stripped,
      SUBJECTS,
      LIMITATION_AUXILIARIES,
      MEDICAL_EXPERTISE_OBJECTS
    )
  ) {
    return { kind: "advice-limitation", signal: "limitation+expertise-object" };
  }

  if (
    matchesSubjectAuxActionObjects(
      stripped,
      SUBJECTS,
      LIMITATION_AUXILIARIES,
      LIMITATION_ACTIONS,
      ADVICE_LIMITATION_OBJECTS
    )
  ) {
    return { kind: "advice-limitation", signal: "limitation+advice-object" };
  }

  if (
    matchesSubjectPrefixActionObjects(
      stripped,
      SUBJECTS,
      ABILITY_LIMITATION_PREFIXES,
      ["provide"],
      DIAGNOSIS_LIMITATION_OBJECTS
    ) ||
    matchesSubjectAuxActionObjects(
      stripped,
      SUBJECTS,
      LIMITATION_AUXILIARIES,
      LIMITATION_ACTIONS,
      DIAGNOSIS_LIMITATION_OBJECTS
    ) ||
    matchesSubjectAuxActionObjects(
      stripped,
      SUBJECTS,
      LIMITATION_AUXILIARIES,
      DIAGNOSIS_ACTIONS,
      DIAGNOSIS_LIMITATION_OBJECTS
    )
  ) {
    return {
      kind: "diagnosis-limitation",
      signal: "limitation+diagnosis-object"
    };
  }

  return undefined;
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax, RuleError, locator, report } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        const matched = matchResponseWrapper(item.sentence.text);
        if (matched === undefined) {
          continue;
        }

        report(
          item.paragraph,
          new RuleError(
            `Response wrapper found: ${matched.kind} (${matched.signal}). Remove assistant response scaffolding.`,
            {
              padding: locator.range([
                item.source.originalStartFor(item.sentence.start),
                item.source.originalEndFor(item.sentence.end)
              ])
            }
          )
        );
      }
    }
  };
};

export default rule;
