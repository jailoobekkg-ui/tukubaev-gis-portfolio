import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", md: "1.5rem" }, screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        bg: v("bg"),
        bg2: v("bg2"),
        fg: v("fg"),
        muted: v("muted"),
        accent: v("accent"),
        accent2: v("accent2"),
        line: v("line"),
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--accent) / 0.25), 0 10px 40px -10px rgb(var(--accent) / 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
