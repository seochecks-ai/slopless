import type { TxtParentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import { sourceText } from "../../shared/text/traverse.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

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

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;
  const helper = new RuleHelper(context);
  const ignoredParents = [
    Syntax.List,
    Syntax.ListItem,
    Syntax.Table,
    Syntax.TableCell
  ];

  return {
    [Syntax.Paragraph](node: TxtParentNode): void {
      if (helper.isChildNode(node, ignoredParents)) {
        return;
      }

      const source = sourceText(node);
      const count = countExclamations(source.text);

      if (count <= MAX_EXCLAMATIONS_PER_PARAGRAPH) {
        return;
      }

      const index = firstExclamationIndex(source.text) ?? 0;

      emitTextlintFinding(context, {
        node: node,
        ruleId: "orthography:exclamation-density",
        message: `Paragraph has ${count} exclamation marks. Keep at most ${MAX_EXCLAMATIONS_PER_PARAGRAPH}.`,
        range: {
          start: source.originalStartFor(index),
          end: source.originalEndFor(index + 1)
        }
      });
    }
  };
};

export default rule;
