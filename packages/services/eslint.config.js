const { config } = require("@repo/eslint-config/base");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  ...config,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
  },
];
