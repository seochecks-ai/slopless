import type { TxtDocumentNode } from "@textlint/ast-node-types";
import type { TextlintRuleModule } from "@textlint/types";
import {
  findUnquotedTokenTemplateMatches,
  type TokenTemplatePattern
} from "../../shared/matchers/phrases.js";
import { allParagraphSentences } from "../../shared/text/sections.js";
import { wordTokens } from "../../shared/text/tokens.js";
import narrativeClichePatterns from "./data/narrative-cliches.json" with { type: "json" };
import { emitTextlintFinding } from "../../adapters/textlint/report.js";

type NarrativeClichePattern = TokenTemplatePattern & {
  readonly category: string;
  readonly purpose: string;
};

const NARRATIVE_CLICHE_PATTERNS =
  narrativeClichePatterns as readonly NarrativeClichePattern[];

const PATTERNS_BY_ID = new Map(
  NARRATIVE_CLICHE_PATTERNS.map((pattern) => [pattern.id, pattern])
);
const CONCRETE_CAUSE_MARKERS = [" because ", " since "];

function hasConcreteCause(sentence: string): boolean {
  const normalized = ` ${sentence.toLocaleLowerCase("en")} `;
  return CONCRETE_CAUSE_MARKERS.some((marker) => normalized.includes(marker));
}

const rule: TextlintRuleModule = (context) => {
  const { Syntax } = context;

  return {
    [Syntax.Document](node: TxtDocumentNode): void {
      for (const item of allParagraphSentences(node)) {
        if (wordTokens(item.sentence.text).length > 80) {
          continue;
        }

        if (hasConcreteCause(item.sentence.text)) {
          continue;
        }

        const match = findUnquotedTokenTemplateMatches(
          item.sentence.text,
          NARRATIVE_CLICHE_PATTERNS
        )[0];
        if (match === undefined) {
          continue;
        }

        const pattern = PATTERNS_BY_ID.get(match.patternId);
        if (pattern === undefined) {
          continue;
        }

        emitTextlintFinding(context, {
          node: item.paragraph,
          ruleId: "narrative-slop:narrative-cliches",
          message: `Narrative cliche (${pattern.category}/${match.patternId}): ${pattern.purpose} Matched template: ${match.template}`,
          range: {
            start: item.source.originalStartFor(
              item.sentence.start + match.start
            ),
            end: item.source.originalEndFor(item.sentence.start + match.end)
          }
        });
      }
    }
  };
};

export default rule;
