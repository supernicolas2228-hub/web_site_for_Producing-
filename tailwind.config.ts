import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "placeholder-glow": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.92" },
        },
        "placeholder-shine": {
          "0%": { transform: "translateX(-100%) skewX(-12deg)" },
          "100%": { transform: "translateX(200%) skewX(-12deg)" },
        },
        /** Лента панчлайна — медленнее, чтобы текст успевали читать */
        "marquee-slow": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        /** Курсор печати — мягкое «дыхание», без резкого pulse */
        "typewriter-caret": {
          "0%, 100%": { opacity: "0.28" },
          "50%": { opacity: "0.95" },
        },
        "hero-glow": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-slow": "marquee-slow 48s linear infinite",
        "placeholder-glow": "placeholder-glow 5.5s ease-in-out infinite",
        "placeholder-shine": "placeholder-shine 9s ease-in-out infinite",
        "typewriter-caret": "typewriter-caret 0.95s ease-in-out infinite",
        "hero-glow": "hero-glow 7s ease-in-out infinite",
      },
      colors: {
        page: "rgb(var(--page-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        band: "rgb(var(--band-rgb) / <alpha-value>)",
        "surface-muted": "rgb(var(--surface-muted-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        /** Границы: на белом — тёмный штрих с alpha, в dark — светлый */
        stroke: "rgb(var(--stroke-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        muted: "#71717a",
        background: "rgb(var(--page-rgb) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        /** Светлая / тёмная тема: задаётся в globals.css */
        plate: "var(--shadow-plate)",
      },
    },
  },
  plugins: [],
};
export default config;
