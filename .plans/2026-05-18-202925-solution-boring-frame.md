# Goal

Catch "the solution-like noun is boring" frames without flagging ordinary concrete entertainment or event judgments such as "the movie is boring" or "the party is boring".

# Approach

- Keep the rule inside `semantic-thinness`.
- Add it as a dedicated pattern instead of folding it into `hollow-significance`, because concrete details after a colon should not suppress this wrapper.
- Add a dedicated solution-like noun slot for nouns that act as "solution" substitutes:
  - answer
  - fix
  - solution
  - strategy
  - plan
  - approach
  - method
  - move
  - option
  - path
  - route
  - way
- Add qualifier variants:
  - right
  - correct
  - good
  - better
  - best
  - practical
  - obvious
  - simple
  - real
  - actual
- Do not include `audit`, `report`, `movie`, `party`, or generic process nouns in the solution-like slot.
- Add hit/no-hit fixtures and corpus preserve metadata.
- Reject empty or whitespace-only CLI file targets so `slopless ""` cannot fall through to textlint as the current directory.

# Verification

- Direct CLI check for positive and negative variants.
- Direct CLI check that an empty path exits 2 before linting.
- Fixture3 check.
- `scripts/verify-all.sh`.
- `npm run validate`.
