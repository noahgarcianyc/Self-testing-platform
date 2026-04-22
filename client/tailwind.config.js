/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f1219",
        surface: "#181c27",
        border: "#2a3142",
        text: "#e8eaef",
        muted: "#8b93a7",
        accent: "#6c9eff",
        "accent-dim": "#4a6fa5",
        success: "#3dd68c",
        error: "#f07178",
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [require("tailwindcss-fonttypo-inter")],
};
