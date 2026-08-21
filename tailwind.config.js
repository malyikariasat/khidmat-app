/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F1EFE6",
        ink: "#1A2E22",
        signal: {
          DEFAULT: "#1F7A4D",
          dark: "#154F32",
          light: "#E7F1EA"
        },
        caution: {
          DEFAULT: "#D98E04",
          dark: "#A66C03",
          light: "#FBEACB"
        },
        brick: {
          DEFAULT: "#A63D2F",
          light: "#F3DFDA"
        },
        line: "#C9C2AE"
      },
      fontFamily: {
        display: ["var(--font-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"]
      },
      backgroundImage: {
        "sector-grid":
          "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
