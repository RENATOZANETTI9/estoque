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
        primary: "#0a0a0f",
        "bg-card": "#13141a",
        accent: "cyan-400",
      },
      gradientColorStops: {
        cyan: "#00ffff",
        blue: "#0000ff",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};

export default config;