import abstractPersonificationLine from "../patterns/abstract-personification-line.json" with { type: "json" };
import bodyEmotionShorthand from "../patterns/body-emotion-shorthand.json" with { type: "json" };
import emptyAtmosphereShift from "../patterns/empty-atmosphere-shift.json" with { type: "json" };
import fixedMetaphorFrame from "../patterns/fixed-metaphor-frame.json" with { type: "json" };
import gazeChoreography from "../patterns/gaze-choreography.json" with { type: "json" };
import sensoryInsteadOfFrame from "../patterns/sensory-instead-of-frame.json" with { type: "json" };
import type { SemanticThinnessPattern } from "./pattern-matcher.js";

export const semanticThinnessPatternSetC: readonly SemanticThinnessPattern[] = [
  abstractPersonificationLine,
  bodyEmotionShorthand,
  emptyAtmosphereShift,
  fixedMetaphorFrame,
  gazeChoreography,
  sensoryInsteadOfFrame
];
