import type { TxtDocumentNode, TxtNode } from "@textlint/ast-node-types";
import { normalizeForMatch } from "../../shared/text/normalize.js";
import { allParagraphs } from "../../shared/text/sections.js";
import type { SourceRange, TextUnit } from "../../rules/types.js";

export function paragraphUnits(document: TxtDocumentNode): TextUnit[] {
  return allParagraphs(document).map((paragraph, index) => ({
    id: `paragraph:${index}`,
    kind: "paragraph",
    node: paragraph.paragraph,
    normalizedText: normalizeForMatch(paragraph.text),
    range: { end: paragraph.source.text.length, start: 0 },
    sourceRangeFor: (range: SourceRange) => ({
      end: paragraph.source.originalEndFor(range.end),
      start: paragraph.source.originalStartFor(range.start)
    }),
    text: paragraph.text
  }));
}

export function textUnitForNode(
  id: string,
  kind: TextUnit["kind"],
  node: TxtNode,
  text: string
): TextUnit {
  return {
    id,
    kind,
    node,
    normalizedText: normalizeForMatch(text),
    range: { end: text.length, start: 0 },
    sourceRangeFor: (range) => range,
    text
  };
}
