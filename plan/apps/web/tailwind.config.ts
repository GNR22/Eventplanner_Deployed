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
        cafe: {
          cream: "#F8F1E5",    // Main Background
          latte: "#E4D4C3",    // Borders & Inputs
          warm: "#C7A68B",     // Accents / Placeholders
          roast: "#7F5539",    // Secondary Text / Icons
          espresso: "#432818", // Headings / Main Text
          darkest: "#2B1B12",  // Hover states / Black replacement
        }
      },
      backgroundImage: {
        "pub-texture": "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/cofee.jpg')",
      },
    },
  },
  plugins: [],
};
export default config;