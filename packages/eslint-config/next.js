const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    require.resolve("@vercel/style-guide/eslint/next"),
    "./base.js",
    "./react.js",
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ["only-warn"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
  ],
  rules: {
    "no-extra-boolean-cast": "off",
  },
  overrides: [
    { files: ["*.js?(x)", "*.ts?(x)"] },
    {
      files: ["src/pages/**/*"],
      rules: {
        "import/no-default-export": "off",
      },
    },
    {
      files: [
        "page.tsx",
        "layout.tsx",
        "not-found.tsx",
        "loading.tsx",
        "error.tsx",
        "global-error.tsx",
        "middleware.ts",
      ],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
