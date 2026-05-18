import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleContext, TextlintRuleModule } from "@textlint/types";
import { emitTextlintReports } from "./report.js";
import type { TextUnit } from "../../rules/types.js";
import type { RuleDefinition } from "../../reporting/types.js";
import { reportsForPolicy } from "../../reporting/reports.js";

type TextlintUnitProvider<Options extends object> = (
  document: TxtDocumentNode,
  context: Readonly<TextlintRuleContext>,
  options: Readonly<Options>
) => readonly TextUnit[];

type TextlintRuleDefinition<Options extends object> =
  RuleDefinition<Options> & {
    readonly units: TextlintUnitProvider<Options>;
  };

export function defineTextlintRule<
  Options extends object = Record<string, never>
>(definition: TextlintRuleDefinition<Options>): TextlintRuleModule<Options> {
  return (context, options = {} as Options) => {
    const { Syntax } = context;

    return {
      [Syntax.Document](document: TxtDocumentNode): void {
        const units = definition.units(document, context, options);
        const unitsById = new Map(units.map((unit) => [unit.id, unit]));
        const detections = definition.detector.detect({
          options,
          ruleId: definition.detector.id,
          units
        });
        const reports = reportsForPolicy(
          units,
          detections,
          definition.reportPolicy,
          definition.formatMessage
        );

        emitTextlintReports(context, unitsById, reports);
      }
    };
  };
}
