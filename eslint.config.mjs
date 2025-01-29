import jest from "eslint-plugin-jest";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/dist/",
        "**/lib/",
        "**/node_modules/",
        "src/functions/__mocks__",
        "**/jest.config.js",
        "**/__mocks__/",
    ],
}, ...compat.extends("plugin:github/recommended", "plugin:jest/recommended", "prettier"), {
    plugins: {
        jest,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...jest.environments.globals.globals,
        },

        parser: tsParser,
        ecmaVersion: 9,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "i18n-text/no-en": "off",
        "eslint-comments/no-use": "off",
        "import/no-namespace": "off",
        "no-unused-vars": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "@typescript-eslint/no-unused-vars": "error",

        "@typescript-eslint/explicit-member-accessibility": ["error", {
            accessibility: "no-public",
        }],

        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/ban-ts-comment": "error",
        camelcase: "off",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

        "@typescript-eslint/explicit-function-return-type": ["error", {
            allowExpressions: true,
        }],

        "@typescript-eslint/func-call-spacing": ["error", "never"],
        "@typescript-eslint/no-array-constructor": "error",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-extraneous-class": "error",
        "@typescript-eslint/no-for-in-array": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-non-null-assertion": "warn",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-useless-constructor": "error",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-for-of": "warn",
        "@typescript-eslint/prefer-function-type": "warn",
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/require-array-sort-compare": "error",
        "@typescript-eslint/restrict-plus-operands": "error",
        semi: "off",
        "@typescript-eslint/semi": ["error", "never"],
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/unbound-method": "error",
        "@typescript-eslint/method-signature-style": "error",
        "@typescript-eslint/no-dynamic-delete": "error",
        "@typescript-eslint/prefer-enum-initializers": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
    },
}];