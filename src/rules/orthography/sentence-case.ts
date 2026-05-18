import type { TxtHeaderNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { RuleHelper } from "textlint-rule-helper";
import { sourceText } from "../../shared/text/traverse.js";
import { splitWhitespace } from "../../shared/text/whitespace.js";
import { emitTextlintNodeFinding } from "../../adapters/textlint/report.js";

const MAX_CAPITALIZED_NON_FIRST_WORDS = 2;
const MAX_RUST_HEADING_DEPTH = 2;

function isUppercaseLetter(character: string): boolean {
  const lower = character.toLocaleLowerCase();
  const upper = character.toLocaleUpperCase();

  return lower !== upper && character === upper;
}

function hasLowercaseLetter(text: string): boolean {
  for (const character of text) {
    const lower = character.toLocaleLowerCase();
    const upper = character.toLocaleUpperCase();

    if (lower !== upper && character === lower) {
      return true;
    }
  }

  return false;
}

function isTitleCased(word: string): boolean {
  const first = word[0];
  if (first === undefined || !isUppercaseLetter(first)) {
    return false;
  }

  return hasLowercaseLetter(word.slice(1));
}

function countCapitalizedNonFirstWords(text: string): number {
  let count = 0;
  const words = splitWhitespace(text);

  for (let index = 1; index < words.length; index += 1) {
    const word = words[index];
    if (word !== undefined && isTitleCased(word)) {
      count += 1;
    }
  }

  return count;
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
    [Syntax.Header](node: TxtHeaderNode): void {
      if (helper.isChildNode(node, ignoredParents)) {
        return;
      }

      if (node.depth > MAX_RUST_HEADING_DEPTH) {
        return;
      }

      const source = sourceText(node);
      const count = countCapitalizedNonFirstWords(source.text);

      if (count <= MAX_CAPITALIZED_NON_FIRST_WORDS) {
        return;
      }

      emitTextlintNodeFinding(context, {
        node: node,
        ruleId: "orthography:sentence-case",
        message: `Heading looks like title case. Use sentence case; found ${count} capitalized non-first words.`
      });
    }
  };
};

export default rule;
