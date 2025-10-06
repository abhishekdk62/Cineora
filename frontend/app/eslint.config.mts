import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // JS and React files
    plugins: { js, react: pluginReact },
    extends: ["js/recommended", "plugin:react/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      // JS/React rules you want to keep or turn off
    },
  },
  {
    files: ["**/*.{ts,tsx}"], // TypeScript files
    parser: tseslint.parsers["@typescript-eslint/parser"],
    plugins: { "@typescript-eslint": tseslint },
    extends: [], // do not extend recommended TS rules
    languageOptions: { globals: globals.browser },
    rules: {
      // Turn off all TypeScript-specific linting
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
    },
  },
]);
