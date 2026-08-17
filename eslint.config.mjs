import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "JSXOpeningElement[name.name=/Trigger$/] > JSXAttribute[name.name='asChild']",
          message: "Do not use 'asChild' on Triggers in Next.js 16.3 (base-ui). Use 'render={<Button />}' instead to prevent <button><button></button></button> hydration errors."
        }
      ]
    }
  }
]);

export default eslintConfig;
