import type { Config } from "tailwindcss";

/**
 * Nordia Tailwind Configuration
 * Premium design system with custom properties
 */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // TeX Gyre Heros - Helvetica-like typeface
        // Used for both body (sans) and display text
        sans: [
          "var(--font-helvetica)",
          "Helvetica Neue",
          "Helvetica",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "var(--font-helvetica)",
          "Helvetica Neue",
          "Helvetica",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        // CSS custom properties for theming
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
