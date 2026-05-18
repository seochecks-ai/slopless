import artifactPlaceholders from "../rules/orthography/artifact-placeholders.js";
import colonDramatic from "../rules/orthography/colon-dramatic.js";
import emDashes from "../rules/orthography/em-dashes.js";
import exclamationDensity from "../rules/orthography/exclamation-density.js";
import fakeTimestamps from "../rules/orthography/fake-timestamps.js";
import hiddenUnicodeControls from "../rules/orthography/hidden-unicode-controls.js";
import sentenceCase from "../rules/orthography/sentence-case.js";
import smartQuotes from "../rules/orthography/smart-quotes.js";

export const orthographyRules = {
  "artifact-placeholders": artifactPlaceholders,
  "colon-dramatic": colonDramatic,
  "em-dashes": emDashes,
  "exclamation-density": exclamationDensity,
  "fake-timestamps": fakeTimestamps,
  "hidden-unicode-controls": hiddenUnicodeControls,
  "sentence-case": sentenceCase,
  "smart-quotes": smartQuotes
};
