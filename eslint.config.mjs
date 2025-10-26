import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import pluginSonarjs from "eslint-plugin-sonarjs";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // Global ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "dist/**",
    "node_modules/**",
    ".vscode/**",
    "next-env.d.ts",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
    "coverage/**",
    ".vercel/**",
  ]),
  
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      sonarjs: pluginSonarjs,
      unicorn: eslintPluginUnicorn,
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.json"],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      react: {
        version: "detect",
      },
    },
    rules: {
      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // React
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off", // Not needed in Next.js
      "react/jsx-no-target-blank": "error",
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      
      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-floating-promises": "off",
      
      // Import
      "import/no-unresolved": "off", // TypeScript handles this
      "import/named": "off",
      "import/namespace": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-duplicates": "error",
      "import/newline-after-import": "warn",
      "import/no-cycle": ["error", { maxDepth: 1 }],
      
      // Simple import sort
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            ["^react", "^next"],
            ["^@?\\w"],
            ["^@/"],
            ["^\\."],
            ["^.+\\.css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "warn",
      
      // Accessibility
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "off", // Next.js handles this differently
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      
      // SonarJS - Code Quality
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/fixme-tag": "off",
      "sonarjs/pseudo-random": "off",
      
      // Unicorn - Code Quality
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-module": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/prefer-top-level-await": "off",
      
      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "warn",
      "no-var": "error",
      "no-debugger": "warn",
      "no-alert": "warn",
      "no-eval": "error",
      "eqeqeq": ["error", "always", { null: "ignore" }],
      "curly": ["warn", "multi-line"],
      
      // Next.js specific
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;
