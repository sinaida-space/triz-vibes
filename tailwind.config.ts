import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f3ead7",
        "paper-deep": "#e4d3b2",
        ink: "#171411",
        "ink-muted": "#5f584f",
        stamp: "#8f1d14",
        card: "#fbf6e9",
        "card-yellow": "#d8c27a"
      },
      fontFamily: {
        body: ["var(--font-body)", "Courier New", "monospace"],
        display: ["var(--font-display)", "Times New Roman", "serif"]
      },
      boxShadow: {
        paper: "0 18px 60px rgba(23, 20, 17, 0.16)"
      }
    }
  },
  plugins: []
};

export default config;
