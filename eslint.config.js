import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";
import importX from "eslint-plugin-import-x";
import regexp from "eslint-plugin-regexp";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import stylePolicy from "g3ts-eslint-plugin-style-policy";

export default [
  {
    ignores: ["legacy/**", "dist/**", "node_modules/**"]
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "@eslint-community/eslint-comments": eslintComments,
      "@typescript-eslint": tseslint,
      "import-x": importX,
      regexp,
      sonarjs,
      "style-policy": stylePolicy,
      unicorn
    },
    rules: {
      "@eslint-community/eslint-comments/no-restricted-disable": [
        "error",
        "style-policy/*",
        "tailwind-ban/*"
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      complexity: ["error", 25],
      eqeqeq: ["error", "always"],
      "import-x/max-dependencies": ["error", { max: 10 }],
      "import-x/no-cycle": ["error", { ignoreExternal: true }],
      "max-lines": ["error", 400],
      "max-lines-per-function": ["error", 100],
      "no-console": "error",
      "no-empty": "error",
      "no-param-reassign": "error",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "escape-string-regexp",
              message: "Regex helpers are not allowed in prose rules."
            }
          ],
          patterns: [
            {
              group: ["*regex*", "*regexp*"],
              message: "Regex packages are not allowed in prose rules."
            }
          ]
        }
      ],
      "no-restricted-globals": ["error", "event", "fdescribe"],
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[regex]",
          message:
            "Do not use regex for prose rule matching. Use tokens, AST nodes, character scans, or token tries."
        },
        {
          selector: "NewExpression[callee.name='RegExp']",
          message:
            "Do not construct regex for prose rule matching. Use shared token matchers."
        },
        {
          selector: "CallExpression[callee.name='RegExp']",
          message:
            "Do not construct regex for prose rule matching. Use shared token matchers."
        }
      ],
      "no-throw-literal": "error",
      "regexp/no-misleading-capturing-group": "error",
      "regexp/prefer-named-backreference": "error",
      "regexp/prefer-named-capture-group": "error",
      "regexp/prefer-result-array-groups": "error",
      "regexp/require-unicode-regexp": "error",
      "regexp/require-unicode-sets-regexp": "error",
      "sonarjs/cognitive-complexity": ["error", 25],
      "sonarjs/expression-complexity": ["error", { max: 25 }],
      "sonarjs/no-all-duplicated-branches": "error",
      "sonarjs/no-async-constructor": "error",
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-collection-size-mischeck": "error",
      "sonarjs/no-duplicated-branches": "error",
      "sonarjs/no-element-overwrite": "error",
      "sonarjs/no-empty-collection": "error",
      "sonarjs/no-gratuitous-expressions": "error",
      "sonarjs/no-hook-setter-in-body": "error",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-identical-expressions": "error",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-invariant-returns": "error",
      "sonarjs/no-inverted-boolean-check": "error",
      "sonarjs/no-nested-switch": "error",
      "sonarjs/no-nested-template-literals": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-redundant-jump": "error",
      "sonarjs/no-unused-collection": "error",
      "sonarjs/no-use-of-empty-return-value": "error",
      "sonarjs/no-useless-react-setstate": "error",
      "sonarjs/prefer-single-boolean-return": "error",
      "style-policy/no-denied-class-tokens": [
        "error",
        {
          classAttributes: ["class", "className"],
          denyList: ["__prosesmasher_denied_class_token__"]
        }
      ],
      "unicorn/no-anonymous-default-export": "error",
      "unicorn/no-keyword-prefix": "error",
      "unicorn/no-unused-properties": "error",
      "unicorn/require-post-message-target-origin": "error"
    }
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "test/**/*.ts", "tests/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];
