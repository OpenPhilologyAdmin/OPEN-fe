module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "next/core-web-vitals",
    "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ["prettier", "simple-import-sort"],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
    "import/no-extraneous-dependencies": 2,
    "import/no-named-as-default": 0,
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
      },
    ],
    "prettier/prettier": [
      "error",
      {
        printWidth: 100,
        arrowParens: "avoid",
        bracketSpacing: true,
        endOfLine: "lf",
        htmlWhitespaceSensitivity: "css",
        insertPragma: false,
        jsxSingleQuote: false,
        proseWrap: "always",
        quoteProps: "as-needed",
        requirePragma: false,
        semi: true,
        trailingComma: "all",
        singleQuote: false,
        tabWidth: 2,
        useTabs: false,
      },
    ],
    "react/function-component-definition": [2, { namedComponents: "function-declaration" }],
    "react/prop-types": 0,
    "react/react-in-jsx-scope": "off",
    // Add blank lines between particular parts of the code.
    "padding-line-between-statements": [
      2,
      // Always require blank lines before return statements.
      { blankLine: "always", prev: "*", next: "return" },

      // Always require blank lines before and after class declaration, if, switch, try.
      {
        blankLine: "always",
        prev: "*",
        next: ["if", "class", "for", "switch", "try"],
      },
      {
        blankLine: "always",
        prev: ["if", "class", "for", "switch", "try"],
        next: "*",
      },

      // Always require blank lines before and after every sequence of variable declarations and export.
      {
        blankLine: "always",
        prev: "*",
        next: ["const", "let", "var", "export"],
      },
      {
        blankLine: "always",
        prev: ["const", "let", "var", "export"],
        next: "*",
      },
      {
        blankLine: "any",
        prev: ["const", "let", "var", "export"],
        next: ["const", "let", "var", "export"],
      },
    ],
    // Automatically sorts imports to ensure their consistency.
    "simple-import-sort/imports": [
      2,
      {
        groups: [
          ["^react", "^next"], // Packages from node_modules. React-related packages will be first.
          ["^\\u0000"], // Side effects.
          ["^[^.]"], // Absolute imports.
          ["^\\."], // Relative imports.
        ],
      },
    ],
    // Disabled as we're using simple-import-sort plugin.
    "import/order": 0,
    "@typescript-eslint/naming-convention": [
      2,
      { selector: "function", format: ["camelCase", "PascalCase"] },
      {
        selector: "parameter",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      { selector: "typeLike", format: ["PascalCase"] },

      // Interfaces shouldn't be prefixed with `I`.
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: { regex: "^I[A-Z]", match: false },
      },

      // Types shouldn't be prefixed with `T`.
      {
        selector: "typeAlias",
        format: ["PascalCase"],
        custom: { regex: "^T[A-Z]", match: false },
      },

      // Generics should have meaningful names instead of one-letters.
      {
        selector: "typeParameter",
        format: ["PascalCase"],
        custom: { regex: "[a-zA-Z]{2,}", match: true },
      },
    ],
  },
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
