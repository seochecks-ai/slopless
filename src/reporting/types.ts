import type {
  RuleDetection,
  RuleDetector,
  RuleId,
  SourceRange
} from "../rules/types.js";

export type Detection<Group extends string = string> = {
  readonly end: number;
  readonly group: Group;
  readonly label: string;
  readonly start: number;
};

export type DensityMatch<Group extends string = string> = {
  readonly count: number;
  readonly end: number;
  readonly group: Group;
  readonly labels: readonly string[];
  readonly start: number;
};

export type ReportPolicy =
  | {
      readonly kind: "one-to-one";
    }
  | {
      readonly groups: readonly string[];
      readonly kind: "density";
      readonly maxParagraphTokens: number;
      readonly maxWindowTokens: number;
      readonly paragraphMinimumHits: number;
      readonly windowMinimumHits: number;
      readonly windowSentences: number;
    }
  | {
      readonly kind: "threshold";
      readonly minimum: number;
      readonly scope: "document" | "paragraph" | "sentence";
    };

export type RuleReport = {
  readonly detections: readonly RuleDetection[];
  readonly evidence: string;
  readonly message: string;
  readonly range: SourceRange;
  readonly ruleId: RuleId;
  readonly unitId: string;
};

export type RuleDefinition<Options = unknown> = {
  readonly detector: RuleDetector<Options>;
  readonly formatMessage: (report: RuleReport) => string;
  readonly reportPolicy: ReportPolicy;
};
