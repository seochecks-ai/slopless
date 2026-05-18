import { oneToOneRule } from "../private/textlint-rule-builders.js";

const HIDDEN_UNICODE_CONTROLS = new Map([
  [0x00ad, "SOFT HYPHEN"],
  [0x200b, "ZERO WIDTH SPACE"],
  [0x200c, "ZERO WIDTH NON-JOINER"],
  [0x200d, "ZERO WIDTH JOINER"],
  [0x200e, "LEFT-TO-RIGHT MARK"],
  [0x200f, "RIGHT-TO-LEFT MARK"],
  [0x202a, "LEFT-TO-RIGHT EMBEDDING"],
  [0x202b, "RIGHT-TO-LEFT EMBEDDING"],
  [0x202c, "POP DIRECTIONAL FORMATTING"],
  [0x202d, "LEFT-TO-RIGHT OVERRIDE"],
  [0x202e, "RIGHT-TO-LEFT OVERRIDE"],
  [0x2060, "WORD JOINER"],
  [0x2066, "LEFT-TO-RIGHT ISOLATE"],
  [0x2067, "RIGHT-TO-LEFT ISOLATE"],
  [0x2068, "FIRST STRONG ISOLATE"],
  [0x2069, "POP DIRECTIONAL ISOLATE"],
  [0xfeff, "ZERO WIDTH NO-BREAK SPACE / BOM"]
]);

function codePointLabel(codePoint: number): string {
  return `U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}`;
}

const rule = oneToOneRule({
  detect: (unit) => {
    const detections = [];
    let start = 0;

    for (const character of unit.text) {
      const codePoint = character.codePointAt(0);
      const name =
        codePoint === undefined
          ? undefined
          : HIDDEN_UNICODE_CONTROLS.get(codePoint);

      if (codePoint !== undefined && name !== undefined) {
        detections.push({
          data: { name },
          evidence: codePointLabel(codePoint),
          label: name,
          range: { start, end: start + character.length }
        });
      }

      start += character.length;
    }

    return detections;
  },
  family: "orthography",
  formatMessage: (report) =>
    `Hidden Unicode control found: ${report.evidence} ${report.detections[0]?.data?.["name"]}. Remove the invisible character.`,
  ruleId: "orthography:hidden-unicode-controls",
  unitKind: "str"
});

export default rule;
