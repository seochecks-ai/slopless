import { isWhitespace } from "../../shared/text/whitespace.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const CLOSED_EM_DASH = "\u2014";

function isClosedEmDash(text: string, index: number): boolean {
  if (text[index] !== CLOSED_EM_DASH) {
    return false;
  }

  return !isWhitespace(text[index - 1]) && !isWhitespace(text[index + 1]);
}

const rule = oneToOneRule({
  detect: (unit) => {
    const detections = [];
    for (let index = 0; index < unit.text.length; index += 1) {
      if (!isClosedEmDash(unit.text, index)) {
        continue;
      }

      detections.push({
        evidence: CLOSED_EM_DASH,
        label: CLOSED_EM_DASH,
        range: { start: index, end: index + CLOSED_EM_DASH.length }
      });
    }
    return detections;
  },
  family: "orthography",
  formatMessage: () =>
    "Closed em dash found. Replace it with a comma, colon, parenthesis, or spaced dash.",
  ruleId: "orthography:em-dashes",
  unitKind: "paragraph"
});

export default rule;
