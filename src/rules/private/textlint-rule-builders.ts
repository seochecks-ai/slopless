import type { TextlintRuleModule } from "@textlint/types";
import { defineTextlintRule } from "../../adapters/textlint/rule.js";
import {
  documentUnit,
  allParagraphUnits,
  headingUnits,
  paragraphUnits,
  linkUnits,
  sectionFirstSentenceUnits,
  sectionLastSentenceUnits,
  sentenceUnits,
  strUnits
} from "../../adapters/textlint/units.js";
import type {
  RuleDetector,
  RuleFamilyId,
  RuleId,
  SourceRange,
  TextUnit
} from "../types.js";
import type { RuleReport } from "../../reporting/types.js";

export type LocalDetection = {
  readonly data?: Readonly<Record<string, boolean | number | string>>;
  readonly evidence: string;
  readonly label: string;
  readonly range: SourceRange;
};

type UnitKind =
  | "document"
  | "all-paragraph"
  | "heading"
  | "paragraph"
  | "link"
  | "section-first-sentence"
  | "section-last-sentence"
  | "sentence"
  | "str";

type DetectionRuleInput<Options extends object> = {
  readonly detect: (
    unit: TextUnit,
    options: Readonly<Options>
  ) => readonly LocalDetection[];
  readonly family: RuleFamilyId;
  readonly formatMessage: (report: RuleReport) => string;
  readonly ignoredAncestorTypes?: readonly string[];
  readonly ruleId: RuleId;
  readonly unitKind: UnitKind;
};

function detector<Options extends object>(
  input: Pick<DetectionRuleInput<Options>, "detect" | "family" | "ruleId">
): RuleDetector<Options> {
  return {
    detect: ({ options, units }) =>
      units.flatMap((unit) =>
        input.detect(unit, options).map((detection) => ({
          ...(detection.data === undefined ? {} : { data: detection.data }),
          evidence: detection.evidence,
          label: detection.label,
          range: detection.range,
          ruleId: input.ruleId,
          unitId: unit.id
        }))
      ),
    family: input.family,
    id: input.ruleId
  };
}

export function oneToOneRule<Options extends object = Record<string, never>>(
  input: DetectionRuleInput<Options>
): TextlintRuleModule<Options> {
  return defineTextlintRule({
    detector: detector(input),
    formatMessage: input.formatMessage,
    reportPolicy: { kind: "one-to-one" },
    units: (document) => {
      switch (input.unitKind) {
        case "document":
          return [documentUnit(document)];
        case "all-paragraph":
          return allParagraphUnits(document, input.ignoredAncestorTypes);
        case "heading":
          return headingUnits(document, input.ignoredAncestorTypes);
        case "paragraph":
          return paragraphUnits(document);
        case "link":
          return linkUnits(document, input.ignoredAncestorTypes);
        case "section-first-sentence":
          return sectionFirstSentenceUnits(document);
        case "section-last-sentence":
          return sectionLastSentenceUnits(document);
        case "sentence":
          return sentenceUnits(document);
        case "str":
          return strUnits(document, input.ignoredAncestorTypes);
      }
    }
  });
}
