import type { Token } from "../../../shared/text/tokens.js";

const CONCRETE_EXPLANATION_TOKENS = new Set([
  "api",
  "archive",
  "dns",
  "doctor",
  "endpoint",
  "facilities",
  "export",
  "generator",
  "html",
  "hydration",
  "hinge",
  "invoice",
  "key",
  "ledger",
  "mark",
  "named",
  "offset",
  "parser",
  "qualified",
  "raw",
  "rebate",
  "removed",
  "repayment",
  "router",
  "server",
  "signal",
  "service",
  "socket",
  "tax",
  "token",
  "volume",
  "wall"
]);
const NUMERIC_EVIDENCE_TOKENS = new Set([
  "date",
  "day",
  "days",
  "dollar",
  "dollars",
  "failed",
  "percent",
  "percentage",
  "quarterly",
  "score",
  "year",
  "years"
]);

function tokenHasDigit(text: string): boolean {
  for (const character of text) {
    if (character >= "0" && character <= "9") {
      return true;
    }
  }

  return false;
}

function isAsciiUppercase(character: string): boolean {
  return character >= "A" && character <= "Z";
}

function isAsciiLowercase(character: string): boolean {
  return character >= "a" && character <= "z";
}

function hasTicketLikeMarker(text: string): boolean {
  for (let index = 0; index < text.length - 3; index += 1) {
    if (
      isAsciiUppercase(text[index] ?? "") &&
      isAsciiUppercase(text[index + 1] ?? "") &&
      text[index + 2] === "-" &&
      tokenHasDigit(text[index + 3] ?? "")
    ) {
      return true;
    }
  }

  return false;
}

function hasDottedIdentifier(text: string): boolean {
  for (let index = 1; index < text.length - 1; index += 1) {
    if (
      text[index] === "." &&
      isAsciiLowercase(text[index - 1] ?? "") &&
      isAsciiLowercase(text[index + 1] ?? "")
    ) {
      return true;
    }
  }

  return false;
}

function hasConcreteMarker(text: string): boolean {
  return (
    text.includes("://") ||
    text.includes("@") ||
    text.includes("`") ||
    hasTicketLikeMarker(text) ||
    hasDottedIdentifier(text)
  );
}

function hasNumericEvidence(tokens: readonly Token[]): boolean {
  return tokens.some((token, index) => {
    if (!tokenHasDigit(token.normalized)) {
      return false;
    }

    return (
      NUMERIC_EVIDENCE_TOKENS.has(tokens[index - 1]?.normalized ?? "") ||
      NUMERIC_EVIDENCE_TOKENS.has(tokens[index + 1]?.normalized ?? "")
    );
  });
}

export function hasConcreteExplanation(tokens: readonly Token[]): boolean {
  return tokens.some((token) =>
    CONCRETE_EXPLANATION_TOKENS.has(token.normalized)
  );
}

export function shouldRejectConcreteEvidence(
  text: string,
  tokens: readonly Token[]
): boolean {
  return hasConcreteMarker(text) || hasNumericEvidence(tokens);
}
