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
        // The Sorter "Dimmed" Palette
        background: "#22272e",
        surface: "#2d333b",
        "surface-hover": "#373e47",
        border: "#444c56",
        muted: "#768390",
        text: "#adbac7",
        
        accent: {
          liella: "#da57da",
          aqours: "#00baff",
          us: "#ec007f",
          nijigasaki: "#f9d653",
          hasunosora: "#c32210",
          ikizuraibu: "#f26c00"
        },
      },
      fontFamily: {
        // Standard system font stack matching the reference site
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "4px",
      },
    },
  },
  plugins: [],
};
export default config;