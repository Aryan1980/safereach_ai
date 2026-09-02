import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050508",
        surface: "#09090d",
        "surface-raised": "#0e0e14",
        "surface-border": "rgba(255, 255, 255, 0.08)",
        "surface-border-subtle": "rgba(255, 255, 255, 0.04)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'SF Pro Display'",
          "'Segoe UI'",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "'SF Mono'",
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "monospace",
        ],
      },
      letterSpacing: {
        widest2: "0.25em",
        widest3: "0.35em",
      },
      animation: {
        "radar-sweep": "radarSweep 4s linear infinite",
        "pulse-subtle": "pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-slow": "glowSlow 6s ease-in-out infinite alternate",
      },
      keyframes: {
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        glowSlow: {
          "0%": { opacity: "0.3" },
          "100%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
