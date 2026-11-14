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
        sarafa: {
          maroon: {
            DEFAULT: "#5B0E2D",
            light: "#801B44",
            dark: "#3F071D",
          },
          gold: {
            DEFAULT: "#D4AF37",
            light: "#F3E5AB",
            dark: "#996515",
          },
          charcoal: {
            DEFAULT: "#1E293B",
            light: "#334155",
            dark: "#0F172A",
          },
          ivory: {
            DEFAULT: "#FFFDF7",
            dark: "#F4EFE6",
          },
          cream: "#FAF8F5",
        },
      },
      fontFamily: {
        hindi: ["Noto Sans Devanagari", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
