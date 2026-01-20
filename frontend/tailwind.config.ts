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
        // High contrast backgrounds
        black: "#050505",
        "zinc-950": "#0a0a0a",
        "zinc-900": "#121212",
        "zinc-800": "#1f1f1f",
        
        // Franchise specific accents (The Sorter style)
        accent: {
          liella: "#f852ad",     // Vibrant Pink
          aqours: "#00baff",     // Bright Cyan
          us: "#ee0000",         // Bold Red
          nijigasaki: "#f7c10d", // Golden Yellow
          hasunosora: "#ff9000", // Deep Orange
        },
      },
      fontFamily: {
        // Using Geist or Inter with heavy weights
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      // Sharp corners for the Sorter look
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
      },
      borderWidth: {
        DEFAULT: "1px",
        "2": "2px",
      },
    },
  },
  plugins: [],
};
export default config;