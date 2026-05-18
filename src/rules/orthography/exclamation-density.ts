import { oneToOneRule } from "../private/textlint-rule-builders.js";

const MAX_EXCLAMATIONS_PER_PARAGRAPH = 1;

function countExclamations(text: string): number {
  let count = 0;

  for (const character of text) {
    if (character === "!") {
      count += 1;
    }
  }

  return count;
}

function firstExclamationIndex(text: string): number | undefined {
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === "!") {
      return index;
    }
  }

  return undefined;
}

const rule = oneToOneRule({
  detect: (unit) => {
    const count = countExclamations(unit.text);
    if (count <= MAX_EXCLAMATIONS_PER_PARAGRAPH) {
      return [];
    }

    const index = firstExclamationIndex(unit.text) ?? 0;
    return [
      {
        evidence: String(count),
        label: "exclamation density",
        range: { start: index, end: index + 1 }
      }
    ];
  },
  family: "orthography",
  formatMessage: (report) =>
    `Paragraph has ${report.evidence} exclamation marks. Keep at most ${MAX_EXCLAMATIONS_PER_PARAGRAPH}.`,
  ruleId: "orthography:exclamation-density",
  unitKind: "paragraph"
});

export default rule;
