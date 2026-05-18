import type { TxtNode } from "@textlint/ast-node-types";
import type { TextlintRuleContext } from "@textlint/types";
import type { TextUnit } from "../../rules/types.js";
import type { RuleDetection, RuleId, SourceRange } from "../../rules/types.js";
import { textUnitForNode } from "./units.js";
import type { RuleReport } from "../../reporting/types.js";
import { oneToOneReports } from "../../reporting/reports.js";

type TextlintTextUnit = TextUnit & {
  readonly node: TxtNode;
};

function isTextlintTextUnit(unit: TextUnit): unit is TextlintTextUnit {
  return (
    typeof unit.node === "object" && unit.node !== null && "type" in unit.node
  );
}

export function emitTextlintReport(
  context: Readonly<TextlintRuleContext>,
  unitsById: ReadonlyMap<string, TextUnit>,
  report: RuleReport
): void {
  const unit = unitsById.get(report.unitId);
  if (unit === undefined || !isTextlintTextUnit(unit)) {
    return;
  }

  const padding =
    report.range.start === report.range.end
      ? context.locator.at(report.range.start)
      : context.locator.range([report.range.start, report.range.end]);

  context.report(
    unit.node,
    new context.RuleError(report.message, {
      padding
    })
  );
}

export function emitTextlintReports(
  context: Readonly<TextlintRuleContext>,
  unitsById: ReadonlyMap<string, TextUnit>,
  reports: readonly RuleReport[]
): void {
  for (const report of reports) {
    emitTextlintReport(context, unitsById, report);
  }
}

type TextlintDetectionInput = {
  readonly data?: Readonly<Record<string, boolean | number | string>>;
  readonly evidence: string;
  readonly label: string;
  readonly message: string;
  readonly range: SourceRange;
  readonly ruleId: RuleId;
  readonly unit: TextUnit;
};

type TextlintFindingInput = {
  readonly data?: Readonly<Record<string, boolean | number | string>>;
  readonly evidence?: string;
  readonly label?: string;
  readonly message: string;
  readonly node: TxtNode;
  readonly range: SourceRange;
  readonly ruleId: RuleId;
};

type TextlintNodeFindingInput = {
  readonly message: string;
  readonly node: TxtNode;
  readonly ruleId: RuleId;
};

export function emitTextlintDetection(
  context: Readonly<TextlintRuleContext>,
  input: TextlintDetectionInput
): void {
  const detection: RuleDetection = {
    evidence: input.evidence,
    label: input.label,
    range: input.range,
    ruleId: input.ruleId,
    unitId: input.unit.id
  };
  if (input.data !== undefined) {
    Object.assign(detection, { data: input.data });
  }

  emitTextlintReports(
    context,
    new Map([[input.unit.id, input.unit]]),
    oneToOneReports([detection], () => input.message)
  );
}

export function emitTextlintFinding(
  context: Readonly<TextlintRuleContext>,
  input: TextlintFindingInput
): void {
  const evidence = input.evidence ?? input.message;
  emitTextlintDetection(context, {
    ...(input.data === undefined ? {} : { data: input.data }),
    evidence,
    label: input.label ?? input.ruleId,
    message: input.message,
    range: input.range,
    ruleId: input.ruleId,
    unit: textUnitForNode("finding", "text", input.node, evidence)
  });
}

export function emitTextlintNodeFinding(
  context: Readonly<TextlintRuleContext>,
  input: TextlintNodeFindingInput
): void {
  context.report(input.node, new context.RuleError(input.message));
}
