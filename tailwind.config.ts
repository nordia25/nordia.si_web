import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
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
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        accent: "var(--accent)",
      },
      fontSize: {
        // Apple-style typography - large, clean, tight tracking
        "display-hero": [
          "clamp(3.5rem, 12vw, 8rem)",
          { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "600" },
        ],
        "display-xl": [
          "clamp(3rem, 8vw, 6rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "600" },
        ],
        "display-lg": [
          "clamp(2.5rem, 6vw, 4.5rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "display-md": [
          "clamp(2rem, 4vw, 3rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "display-sm": [
          "clamp(1.5rem, 2.5vw, 2rem)",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        title: [
          "clamp(1.25rem, 2vw, 1.5rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "500" },
        ],
        "body-xl": ["1.375rem", { lineHeight: "1.7", fontWeight: "400" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7", fontWeight: "400" }],
        body: ["1rem", { lineHeight: "1.7", fontWeight: "400" }],
        "body-sm": ["0.9375rem", { lineHeight: "1.6", fontWeight: "400" }],
        caption: [
          "0.8125rem",
          { lineHeight: "1.5", letterSpacing: "0.01em", fontWeight: "500" },
        ],
        overline: [
          "0.6875rem",
          { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "600" },
        ],
      },
      spacing: {
        section: "clamp(8rem, 20vh, 16rem)",
        "section-sm": "clamp(5rem, 12vh, 10rem)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "apple-bounce": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "fade-up": "fadeUp 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "scale-in": "scaleIn 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "scroll-line": "scrollLine 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scrollLine: {
          "0%": { top: "-50%" },
          "100%": { top: "100%" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
