import { defineTextlintRule } from "../../../adapters/textlint/rule.js";
import {
  sectionLastSentenceUnits,
  sentenceUnits
} from "../../../adapters/textlint/units.js";
import { wordTokens } from "../../../shared/text/tokens.js";

const CLOSERS = ["and that's the key.", "that's what matters."];

function isFormulaLine(text: string): boolean {
  const lower = text.toLocaleLowerCase("en");

  return (
    wordTokens(text).length <= 6 &&
    (lower.startsWith("that's the ") || lower.startsWith("that is the "))
  );
}

const rule = defineTextlintRule({
  detector: {
    detect: ({ units }) =>
      units.flatMap((unit) => {
        const lower = unit.text.toLocaleLowerCase("en");
        const closer = unit.id.startsWith("section-last-sentence:")
          ? CLOSERS.find((phrase) => lower.endsWith(phrase))
          : undefined;
        if (closer !== undefined) {
          return [
            {
              evidence: closer,
              label: "affirmation-closer",
              range: { start: 0, end: unit.text.length },
              ruleId: "syntactic-patterns:affirmation-closers" as const,
              unitId: unit.id
            }
          ];
        }

        if (!isFormulaLine(unit.text)) {
          return [];
        }

        return [
          {
            evidence: unit.text,
            label: "formula-affirmation",
            range: { start: 0, end: unit.text.length },
            ruleId: "syntactic-patterns:affirmation-closers" as const,
            unitId: unit.id
          }
        ];
      }),
    family: "syntactic-patterns",
    id: "syntactic-patterns:affirmation-closers"
  },
  formatMessage: (report) =>
    report.detections[0]?.label === "affirmation-closer"
      ? `Affirmation closer found: "${report.evidence}". Replace the empty affirmation with the actual conclusion.`
      : `Formula affirmation found: "${report.evidence}". Replace the empty formula line with substance.`,
  reportPolicy: { kind: "one-to-one" },
  units: (document) => {
    const tailUnits = sectionLastSentenceUnits(document);
    return [
      ...tailUnits,
      ...sentenceUnits(document).filter(
        (unit) =>
          !tailUnits.some(
            (tailUnit) =>
              tailUnit.text === unit.text && tailUnit.node === unit.node
          )
      )
    ];
  }
});

export default rule;
