module.exports = {
  content: ["./app/**/*.{js,jsx}", "./data/**/*.js"],
  theme: {
    extend: {
      // Vintage circus-poster palette: faded red, mustard, teal, cream, warm black
      colors: { ink: "#231815", bubble: "#B3202A", teal: "#4F9D96", mustard: "#E3A93B", grape: "#2C4A68", bone: "#F4E8C8", rust: "#7A3418" },
      fontFamily: { display: ["var(--font-display)", "serif"], slab: ["var(--font-slab)", "serif"], type: ["var(--font-type)", "monospace"], body: ["var(--font-body)", "sans-serif"] },
    },
  },
  plugins: [],
};
