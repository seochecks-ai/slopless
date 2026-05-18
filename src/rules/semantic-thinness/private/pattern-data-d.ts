import bodyKnows from "../patterns/body-knows.json" with { type: "json" };
import deicticSummary from "../patterns/deictic-summary.json" with { type: "json" };
import pointIsFrame from "../patterns/point-is-frame.json" with { type: "json" };
import pufferyEvaluativeClaim from "../patterns/puffery-evaluative-claim.json" with { type: "json" };
import realWorkBegins from "../patterns/real-work-begins.json" with { type: "json" };
import silenceAsActor from "../patterns/silence-as-actor.json" with { type: "json" };
import solutionBoringFrame from "../patterns/solution-boring-frame.json" with { type: "json" };
import somethingShifted from "../patterns/something-shifted.json" with { type: "json" };
import truthAnswerMoves from "../patterns/truth-answer-moves.json" with { type: "json" };
import type { SemanticThinnessPattern } from "./pattern-matcher.js";

export const semanticThinnessPatternSetD: readonly SemanticThinnessPattern[] = [
  bodyKnows,
  deicticSummary,
  pointIsFrame,
  pufferyEvaluativeClaim,
  realWorkBegins,
  silenceAsActor,
  solutionBoringFrame,
  somethingShifted,
  truthAnswerMoves
];
