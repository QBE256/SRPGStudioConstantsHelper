import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

export default [{
  files: ["**/*.ts"],
  ignores: ["src/test/testFile/**/*"],
}, {
  plugins: {
    "@typescript-eslint": typescriptEslint,
  },

  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2022,
    sourceType: "module",
  },

  rules: {
    "@typescript-eslint/naming-convention": ["warn", {
      selector: "import",
      format: ["camelCase", "PascalCase"],
    }],

    curly: "warn",
    eqeqeq: "warn",
    "no-throw-literal": "warn",
    semi: ["error", "never"],
    indent: ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
  },
}]
