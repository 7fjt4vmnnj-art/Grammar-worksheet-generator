import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1c1915",
        moss: "#1f4d3a",
        mossdark: "#16382b",
        clay: "#8c3a2f",
        paper: "#f6f1e7",
        card: "#fffdf8",
        line: "#e3d9c8",
        mist: "#f3ece2",
      },
      fontFamily: {
        serif: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Palatino",
          "Georgia",
          "serif",
        ],
        sans: [
          "Avenir Next",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        paper: "0 18px 50px rgba(48, 36, 18, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
