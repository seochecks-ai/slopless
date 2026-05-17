import cliches from "../families/phrases/cliches.js";
import corporateSpeak from "../families/phrases/corporate-speak.js";
import humbleBragger from "../families/phrases/humble-bragger.js";
import jargonFaker from "../families/phrases/jargon-faker.js";
import llmDisclaimer from "../families/phrases/llm-disclaimer.js";
import prohibitedPhrases from "../families/phrases/prohibited-phrases.js";
import redundancy from "../families/phrases/redundancy.js";
import skunkedTerms from "../families/phrases/skunked-terms.js";
import uncomparables from "../families/phrases/uncomparables.js";
import wordiness from "../families/phrases/wordiness.js";

export const phraseRules = {
  cliches,
  "corporate-speak": corporateSpeak,
  "humble-bragger": humbleBragger,
  "jargon-faker": jargonFaker,
  "llm-disclaimer": llmDisclaimer,
  "prohibited-phrases": prohibitedPhrases,
  redundancy,
  "skunked-terms": skunkedTerms,
  uncomparables,
  wordiness
};
