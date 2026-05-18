import type {
  AnyTxtNode,
  TxtDocumentNode,
  TxtHeaderNode,
  TxtLinkNode,
  TxtNode,
  TxtParagraphNode,
  TxtParentNode,
  TxtStrNode
} from "@textlint/ast-node-types";
import { normalizeForMatch } from "../../shared/text/normalize.js";
import {
  allParagraphSentences,
  allParagraphs,
  sectionFirstSentences,
  sectionLastSentences
} from "../../shared/text/sections.js";
import { documentText } from "../../shared/text/document.js";
import type { SourceRange, TextUnit } from "../../rules/types.js";
import { sourceText } from "../../shared/text/traverse.js";

type VisitState = {
  readonly ancestors: readonly AnyTxtNode[];
  readonly node: AnyTxtNode;
};

function isParentNode(node: AnyTxtNode): node is TxtParentNode {
  return "children" in node;
}

function visitNodes(
  node: AnyTxtNode,
  ancestors: readonly AnyTxtNode[],
  visitor: (state: VisitState) => void
): void {
  visitor({ ancestors, node });

  if (!isParentNode(node)) {
    return;
  }

  for (const child of node.children) {
    visitNodes(child, [...ancestors, node], visitor);
  }
}

function hasIgnoredAncestor(
  ancestors: readonly AnyTxtNode[],
  ignoredTypes: ReadonlySet<string>
): boolean {
  return ancestors.some((ancestor) => ignoredTypes.has(ancestor.type));
}

function isHeaderNode(node: AnyTxtNode): node is TxtHeaderNode {
  return node.type === "Header";
}

function isParagraphNode(node: AnyTxtNode): node is TxtParagraphNode {
  return node.type === "Paragraph";
}

function isStrNode(node: AnyTxtNode): node is TxtStrNode {
  return node.type === "Str";
}

function isLinkNode(node: AnyTxtNode): node is TxtLinkNode {
  return node.type === "Link";
}

function sentenceUnit(
  id: string,
  item: ReturnType<typeof allParagraphSentences>[number]
): TextUnit {
  return {
    id,
    kind: "sentence",
    node: item.paragraph,
    normalizedText: normalizeForMatch(item.sentence.text),
    range: { end: item.sentence.text.length, start: 0 },
    sourceRangeFor: (range: SourceRange) => ({
      end: item.source.originalEndFor(item.sentence.start + range.end),
      start: item.source.originalStartFor(item.sentence.start + range.start)
    }),
    text: item.sentence.text
  };
}

export function documentUnit(document: TxtDocumentNode): TextUnit {
  const text = documentText(document);

  return {
    id: "document:0",
    kind: "document",
    node: document,
    normalizedText: normalizeForMatch(text),
    range: { end: text.length, start: 0 },
    sourceRangeFor: (range) => range,
    text
  };
}

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

export function sentenceUnits(document: TxtDocumentNode): TextUnit[] {
  return allParagraphSentences(document).map((item, index) =>
    sentenceUnit(`sentence:${index}`, item)
  );
}

export function sectionFirstSentenceUnits(
  document: TxtDocumentNode
): TextUnit[] {
  return sectionFirstSentences(document).map((item, index) =>
    sentenceUnit(`section-first-sentence:${index}`, item)
  );
}

export function sectionLastSentenceUnits(
  document: TxtDocumentNode
): TextUnit[] {
  return sectionLastSentences(document).map((item, index) =>
    sentenceUnit(`section-last-sentence:${index}`, item)
  );
}

export function headingUnits(
  document: TxtDocumentNode,
  ignoredAncestorTypes: readonly string[] = []
): TextUnit[] {
  const ignoredTypes = new Set(ignoredAncestorTypes);
  const units: TextUnit[] = [];

  visitNodes(document, [], ({ ancestors, node }) => {
    if (!isHeaderNode(node) || hasIgnoredAncestor(ancestors, ignoredTypes)) {
      return;
    }

    const source = sourceText(node);
    units.push({
      id: `heading:${units.length}`,
      kind: "heading",
      node,
      normalizedText: normalizeForMatch(source.text),
      range: { end: source.text.length, start: 0 },
      sourceRangeFor: (range) => ({
        end: source.originalEndFor(range.end),
        start: Math.max(0, source.originalStartFor(range.start) - 3)
      }),
      text: source.text
    });
  });

  return units;
}

export function allParagraphUnits(
  document: TxtDocumentNode,
  ignoredAncestorTypes: readonly string[] = []
): TextUnit[] {
  const ignoredTypes = new Set(ignoredAncestorTypes);
  const units: TextUnit[] = [];

  visitNodes(document, [], ({ ancestors, node }) => {
    if (!isParagraphNode(node) || hasIgnoredAncestor(ancestors, ignoredTypes)) {
      return;
    }

    const source = sourceText(node);
    units.push({
      id: `all-paragraph:${units.length}`,
      kind: "paragraph",
      node,
      normalizedText: normalizeForMatch(source.text),
      range: { end: source.text.length, start: 0 },
      sourceRangeFor: (range) => ({
        end: source.originalEndFor(range.end),
        start: source.originalStartFor(range.start)
      }),
      text: source.text
    });
  });

  return units;
}

export function strUnits(
  document: TxtDocumentNode,
  ignoredAncestorTypes: readonly string[] = []
): TextUnit[] {
  const ignoredTypes = new Set(ignoredAncestorTypes);
  const units: TextUnit[] = [];

  visitNodes(document, [], ({ ancestors, node }) => {
    if (!isStrNode(node) || hasIgnoredAncestor(ancestors, ignoredTypes)) {
      return;
    }

    units.push(
      textUnitForNode(`str:${units.length}`, "text", node, node.value)
    );
  });

  return units;
}

export function linkUnits(
  document: TxtDocumentNode,
  ignoredAncestorTypes: readonly string[] = []
): TextUnit[] {
  const ignoredTypes = new Set(ignoredAncestorTypes);
  const units: TextUnit[] = [];

  visitNodes(document, [], ({ ancestors, node }) => {
    if (!isLinkNode(node) || hasIgnoredAncestor(ancestors, ignoredTypes)) {
      return;
    }

    units.push(textUnitForNode(`link:${units.length}`, "text", node, node.url));
  });

  return units;
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
