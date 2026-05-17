import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
      },
      colors: {
        blue: {
          deep: "#1B3A5C",
          mid: "#2A5F8A",
          light: "#B8D9E8",
          pale: "#E8F4F9",
        },
        burgundy: {
          DEFAULT: "#6B1A1A",
          dark: "#4A1010",
          light: "#9B3535",
          pale: "#F5E8E8",
        },
        cream: "#FAFAF7",
        parchment: "#F3F1EB",
        stone: "#C7C7CC",
        ink: {
          DEFAULT: "#1C1C1E",
          soft: "#48484A",
          muted: "#8E8E93",
        },
      },
      borderWidth: {
        "3": "3px",
      },
    },
  },
  plugins: [],
};
export default config;
