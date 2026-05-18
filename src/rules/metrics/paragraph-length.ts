import { splitSentences } from "../../shared/text/sentences.js";
import { oneToOneRule } from "../private/textlint-rule-builders.js";

const MAX_SENTENCES = 6;

const rule = oneToOneRule({
  detect: (unit) => {
    const sentenceCount = splitSentences(unit.text).length;
    if (sentenceCount <= MAX_SENTENCES) {
      return [];
    }

    return [
      {
        evidence: String(sentenceCount),
        label: "paragraph sentence count",
        range: { start: 0, end: unit.text.length }
      }
    ];
  },
  family: "metrics",
  formatMessage: (report) =>
    `Paragraph has ${report.evidence} sentences. Keep paragraphs to ${MAX_SENTENCES} sentences or fewer.`,
  ruleId: "metrics:paragraph-length",
  unitKind: "paragraph"
});

export default rule;
