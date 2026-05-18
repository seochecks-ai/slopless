import { splitSentences } from "../shared/text/sentences.js";
import { wordTokens } from "../shared/text/tokens.js";
import type { RuleDetection, TextUnit } from "../rules/types.js";
import type { DensityMatch, ReportPolicy, RuleReport } from "./types.js";

type DensityReportConfig<Group extends string> = {
  readonly groups: readonly Group[];
  readonly maxParagraphTokens: number;
  readonly maxWindowTokens: number;
  readonly message: (match: DensityMatch<Group>) => string;
  readonly paragraphMinimumHits: number;
  readonly windowMinimumHits: number;
  readonly windowSentences: number;
};

type Span = {
  readonly end: number;
  readonly start: number;
};

function detectionWithin(
  detection: RuleDetection,
  span: Span
): detection is RuleDetection & { readonly group: string } {
  return (
    detection.group !== undefined &&
    detection.range.start >= span.start &&
    detection.range.end <= span.end
  );
}

function densityMatchForSpan<Group extends string>(
  detections: readonly RuleDetection<Group>[],
  span: Span,
  minimumHits: number,
  groups: readonly Group[]
): DensityMatch<Group> | undefined {
  const spanDetections = detections.filter((detection) =>
    detectionWithin(detection, span)
  );

  for (const group of groups) {
    const hits = spanDetections.filter(
      (detection) => detection.group === group
    );
    if (hits.length < minimumHits) {
      continue;
    }

    const first = hits[0];
    const last = hits.at(-1);
    if (first === undefined || last === undefined) {
      continue;
    }

    return {
      count: hits.length,
      end: last.range.end,
      group,
      labels: [...new Set(hits.map((hit) => hit.label))],
      start: first.range.start
    };
  }

  return undefined;
}

function firstDensityReportMatch<Group extends string>(
  unit: TextUnit,
  detections: readonly RuleDetection<Group>[],
  config: DensityReportConfig<Group>
): DensityMatch<Group> | undefined {
  if (wordTokens(unit.text).length <= config.maxParagraphTokens) {
    const paragraphMatch = densityMatchForSpan(
      detections,
      { end: unit.text.length, start: 0 },
      config.paragraphMinimumHits,
      config.groups
    );
    if (paragraphMatch !== undefined) {
      return paragraphMatch;
    }
  }

  const sentences = splitSentences(unit.text);
  for (let index = 0; index < sentences.length; index += 1) {
    const window = sentences.slice(index, index + config.windowSentences);
    if (window.length < 2) {
      continue;
    }

    const first = window[0];
    const last = window.at(-1);
    if (first === undefined || last === undefined) {
      continue;
    }

    if (
      wordTokens(unit.text.slice(first.start, last.end)).length >
      config.maxWindowTokens
    ) {
      continue;
    }

    const windowMatch = densityMatchForSpan(
      detections,
      { end: last.end, start: first.start },
      config.windowMinimumHits,
      config.groups
    );
    if (windowMatch !== undefined) {
      return windowMatch;
    }
  }

  return undefined;
}

export function oneToOneReports(
  detections: readonly RuleDetection[],
  message: (detection: RuleDetection) => string
): RuleReport[] {
  return detections.map((detection) => ({
    detections: [detection],
    evidence: detection.evidence,
    message: message(detection),
    range: detection.range,
    ruleId: detection.ruleId,
    unitId: detection.unitId
  }));
}

export function densityReports<Group extends string>(
  unit: TextUnit,
  detections: readonly RuleDetection<Group>[],
  config: DensityReportConfig<Group>
): RuleReport[] {
  const match = firstDensityReportMatch(unit, detections, config);
  if (match === undefined) {
    return [];
  }

  const matchingDetections = detections.filter(
    (detection) =>
      detection.group === match.group &&
      detection.range.start >= match.start &&
      detection.range.end <= match.end
  );
  const firstDetection = matchingDetections[0];
  if (firstDetection === undefined) {
    return [];
  }

  return [
    {
      detections: matchingDetections,
      evidence: unit.text.slice(match.start, match.end),
      message: config.message(match),
      range: unit.sourceRangeFor({ end: match.end, start: match.start }),
      ruleId: firstDetection.ruleId,
      unitId: unit.id
    }
  ];
}

export function reportsForPolicy(
  units: readonly TextUnit[],
  detections: readonly RuleDetection[],
  policy: ReportPolicy,
  formatMessage: (report: RuleReport) => string
): RuleReport[] {
  switch (policy.kind) {
    case "one-to-one": {
      const unitsById = new Map(units.map((unit) => [unit.id, unit]));
      const reports = detections.map((detection) => {
        const unit = unitsById.get(detection.unitId);
        return {
          detections: [detection],
          evidence: detection.evidence,
          message: "",
          range: unit?.sourceRangeFor(detection.range) ?? detection.range,
          ruleId: detection.ruleId,
          unitId: detection.unitId
        };
      });
      return reports.map((report) => ({
        ...report,
        message: formatMessage(report)
      }));
    }

    case "density": {
      const reports: RuleReport[] = [];
      for (const unit of units) {
        reports.push(
          ...densityReports(
            unit,
            detections.filter(
              (detection) => detection.unitId === unit.id
            ) as readonly RuleDetection<string>[],
            {
              groups: policy.groups,
              maxParagraphTokens: policy.maxParagraphTokens,
              maxWindowTokens: policy.maxWindowTokens,
              message: () => "",
              paragraphMinimumHits: policy.paragraphMinimumHits,
              windowMinimumHits: policy.windowMinimumHits,
              windowSentences: policy.windowSentences
            }
          ).map((report) => ({
            ...report,
            message: formatMessage(report)
          }))
        );
      }
      return reports;
    }

    case "threshold": {
      if (policy.scope !== "document" || detections.length <= policy.minimum) {
        return [];
      }

      const reports = oneToOneReports(detections, () => "");
      return reports.map((report) => ({
        ...report,
        message: formatMessage(report)
      }));
    }
  }
}
