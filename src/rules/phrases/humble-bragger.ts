import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import { findPhraseMatches } from "../../shared/matchers/phrases.js";
import { allParagraphSentences } from "../../shared/text/sections.js";
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

const HUMBLE_BRAGGER_PHRASES = [
  "in my experience",
  "as someone who has",
  "having worked with"
];

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        for (const match of findPhraseMatches(
          item.sentence.text,
          HUMBLE_BRAGGER_PHRASES
        )) {
          emitTextlintFinding(context, {
            node: item.paragraph,
            ruleId: "phrases:humble-bragger",
            message: `Humble-bragging phrase found: "${match.text}". Remove the credentialing lead-in.`,
            range: {
              start: item.source.originalStartFor(
                item.sentence.start + match.start
              ),
              end: item.source.originalEndFor(item.sentence.start + match.end)
            }
          });
        }
      }
    }
  };
};

export default rule;
