export type RuleFamilyId =
  | "academic-slop"
  | "markdown-layout"
  | "metrics"
  | "narrative-slop"
  | "orthography"
  | "phrases"
  | "semantic-thinness"
  | "syntactic-patterns"
  | "term-policy"
  | "words";

export type RuleId = `${RuleFamilyId}:${string}`;

export type TextUnitKind =
  | "document"
  | "heading"
  | "paragraph"
  | "sentence"
  | "text";

export type SourceRange = {
  readonly end: number;
  readonly start: number;
};

export type TextUnit = {
  readonly id: string;
  readonly kind: TextUnitKind;
  readonly node: unknown;
  readonly normalizedText: string;
  readonly range: SourceRange;
  readonly sourceRangeFor: (range: SourceRange) => SourceRange;
  readonly text: string;
};

export type RuleInput<Options = unknown> = {
  readonly options: Options;
  readonly ruleId: RuleId;
  readonly units: readonly TextUnit[];
};

export type RuleDetection<Group extends string = string> = {
  readonly data?: Readonly<Record<string, boolean | number | string>>;
  readonly evidence: string;
  readonly group?: Group;
  readonly label: string;
  readonly range: SourceRange;
  readonly ruleId: RuleId;
  readonly unitId: string;
};

export type RuleDetector<Options = unknown> = {
  readonly detect: (input: RuleInput<Options>) => readonly RuleDetection[];
  readonly family: RuleFamilyId;
  readonly id: RuleId;
};
