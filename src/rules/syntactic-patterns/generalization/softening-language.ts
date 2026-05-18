import {
  cleanSentence,
  containsAny,
  tokens,
  type SentenceMatch
} from "../../../shared/matchers/prose-patterns.js";
import { oneToOneRule } from "../../private/textlint-rule-builders.js";

const MODAL_PATTERNS = [" could ", " may ", " might "];
const QUALIFIER_PATTERNS = [
  " broadly ",
  " generally ",
  " largely ",
  " typically ",
  " commonly ",
  " potentially ",
  " relatively ",
  " usually "
];
const VARIABILITY_PATTERNS = [
  "in some individuals",
  "in some people",
  "in some children",
  "in some cases",
  "from person to person",
  "may not necessarily",
  "not necessarily",
  "not all individuals",
  "not all people"
];
const REPORTING_PATTERNS = [
  "is believed",
  "are believed",
  "generally considered",
  "is often seen",
  "are often seen",
  "is often treated",
  "are often treated",
  "has been reported",
  "have been reported",
  "it is thought",
  "it is believed",
  "research suggests",
  "studies suggest",
  "studies have suggested",
  "more research is needed"
];
const QUANTIFIER_LEADS = ["many", "most", "some", "certain", "various"];
const QUANTIFIER_TARGETS = [
  "adults",
  "children",
  "couples",
  "families",
  "people",
  "individuals",
  "kids",
  "moms",
  "parents",
  "experts",
  "research",
  "studies",
  "foods",
  "factors",
  "types",
  "cases",
  "patients",
  "patterns",
  "problems",
  "ways"
];

function findQuantifierPair(text: string): string | undefined {
  const words = tokens(text);

  for (let index = 0; index < words.length - 1; index += 1) {
    const lead = words[index];
    const target = words[index + 1];

    if (
      lead !== undefined &&
      target !== undefined &&
      QUANTIFIER_LEADS.includes(lead) &&
      QUANTIFIER_TARGETS.includes(target)
    ) {
      return `${lead} ${target}`;
    }
  }

  return undefined;
}

function matchSoftening(sentence: string): SentenceMatch | undefined {
  const normalized = ` ${cleanSentence(sentence)} `;
  const modal = containsAny(normalized, MODAL_PATTERNS);
  const qualifier = containsAny(normalized, QUALIFIER_PATTERNS);
  const variability = containsAny(normalized, VARIABILITY_PATTERNS);
  const reporting = containsAny(normalized, REPORTING_PATTERNS);
  const quantifier = findQuantifierPair(normalized);
  const signalCount =
    Number(modal !== undefined) +
    Number(qualifier !== undefined) +
    Number(variability !== undefined) +
    Number(reporting !== undefined) +
    Number(quantifier !== undefined);

  if (signalCount < 2) {
    return undefined;
  }

  if (modal !== undefined && variability !== undefined) {
    return {
      kind: "variability-softening",
      signal: `${modal} + ${variability}`
    };
  }
  if (modal !== undefined && qualifier !== undefined) {
    return { kind: "hedged-claim", signal: `${modal} + ${qualifier}` };
  }
  if (modal !== undefined && quantifier !== undefined) {
    return { kind: "quantified-softening", signal: `${modal} + ${quantifier}` };
  }
  if (reporting !== undefined && modal !== undefined) {
    return { kind: "tentative-reporting", signal: `${reporting} + ${modal}` };
  }
  if (reporting !== undefined && quantifier !== undefined) {
    return {
      kind: "tentative-reporting",
      signal: `${reporting} + ${quantifier}`
    };
  }
  if (variability !== undefined && quantifier !== undefined) {
    return {
      kind: "variability-softening",
      signal: `${variability} + ${quantifier}`
    };
  }

  return { kind: "stacked-softening", signal: "multiple softening signals" };
}

const rule = oneToOneRule({
  detect: (unit) => {
    const matched = matchSoftening(unit.text);
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
    `Softening language found: ${report.evidence}. Make the claim specific or remove the hedge stack.`,
  ruleId: "syntactic-patterns:softening-language",
  unitKind: "sentence"
});

export default rule;
