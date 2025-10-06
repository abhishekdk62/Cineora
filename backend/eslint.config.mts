import tsplugin from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.ts"],
    parser: tsparser,
    plugins: { "@typescript-eslint": tsplugin },
    extends: [], // remove recommended rules
    languageOptions: { globals: globals.node },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      semi: "off",
      quotes: "off"
    }
  }
]);
