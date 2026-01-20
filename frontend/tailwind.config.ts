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
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          liella: "#f852ad",
          aqours: "#00baff",
          us: "#ee0000",
        },
      },
      borderRadius: {
        sorter: "4px", // The Sorter uses sharper corners
      },
    },
  },
  plugins: [],
};
export default config;