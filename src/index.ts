import { everything } from "./presets/everything.js";
import { academicSlopRules } from "./registries/academic-slop.js";
import { metricRules } from "./registries/metrics.js";
import { narrativeSlopRules } from "./registries/narrative-slop.js";
import { orthographyRules } from "./registries/orthography.js";
import { phraseRules } from "./registries/phrases.js";
import { semanticThinnessRules } from "./registries/semantic-thinness.js";
import { syntacticPatternRules } from "./registries/syntactic-patterns.js";
import { termPolicyRules } from "./registries/term-policy.js";
import { wordRules } from "./registries/words.js";

export const rules = {
  ...academicSlopRules,
  ...metricRules,
  ...narrativeSlopRules,
  ...orthographyRules,
  ...phraseRules,
  ...semanticThinnessRules,
  ...syntacticPatternRules,
  ...termPolicyRules,
  ...wordRules
};

export const presets = {
  everything
};

export const rulesConfig = everything.rules;

export default {
  rules,
  rulesConfig
};
