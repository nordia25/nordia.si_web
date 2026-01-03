import nextConfig from "eslint-config-next";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = [
  // Ignore patterns - must be first
  {
    ignores: [
      "brunsohn-clone/**",
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
    ],
  },
  ...nextConfig,
  eslintConfigPrettier,
];

export default eslintConfig;
