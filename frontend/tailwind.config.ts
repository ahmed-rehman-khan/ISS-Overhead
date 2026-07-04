import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "space-black": "#04050a",
        "deep-navy":   "#080c18",
        "panel-bg":    "rgba(12,18,35,0.85)",
        accent:        "#00d4ff",
        "accent-dim":  "rgba(0,212,255,0.12)",
        "glow-blue":   "#3b8beb",
        "text-primary":   "#e8f0ff",
        "text-secondary": "#7090b0",
        "text-muted":     "#3a5070",
      },
      fontFamily: {
        sans:  ["var(--font-syne)", "sans-serif"],
        mono:  ["var(--font-space-mono)", "monospace"],
      },
      animation: {
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        float:        "float 3s ease-in-out infinite",
        scanline:     "scanline 4s linear infinite",
        blink:        "blink 1s step-end infinite",
      },
      keyframes: {
        "pulse-ring": {
          "0%":   { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        scanline: {
          "0%":   { top: "-2px" },
          "100%": { top: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
