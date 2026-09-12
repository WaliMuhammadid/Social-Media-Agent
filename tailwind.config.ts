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
        "meta-blue": "#0064e0",
        "meta-blue-hover": "#0053ba",
        "meta-blue-light": "#ebf5ff",
        "brand-border": "#e5e7eb",
        "panel-bg": "#ffffff",
        "pine": {
          900: "#0f2e22",
          800: "#14532d",
          700: "#15803d",
          600: "#16a34a",
          50: "#f0fdf4",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 2px 14px -2px rgba(0, 0, 0, 0.04), 0 1px 4px -1px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 8px 24px -4px rgba(0, 0, 0, 0.07), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
