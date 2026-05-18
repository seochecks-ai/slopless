import type { TxtParentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import { sourceText } from "../../shared/text/traverse.js";
import { isWhitespace } from "../../shared/text/whitespace.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const CLOSED_EM_DASH = "\u2014";

function isClosedEmDash(text: string, index: number): boolean {
  if (text[index] !== CLOSED_EM_DASH) {
    return false;
  }

  return !isWhitespace(text[index - 1]) && !isWhitespace(text[index + 1]);
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

      for (let index = 0; index < source.text.length; index += 1) {
        if (!isClosedEmDash(source.text, index)) {
          continue;
        }

        emitTextlintFinding(context, {
          node: node,
          ruleId: "orthography:em-dashes",
          message:
            "Closed em dash found. Replace it with a comma, colon, parenthesis, or spaced dash.",
          range: {
            start: source.originalStartFor(index),
            end: source.originalEndFor(index + CLOSED_EM_DASH.length)
          }
        });
      }
    }
  };
};

export default rule;
