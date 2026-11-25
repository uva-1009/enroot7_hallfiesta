module.exports = {
  content: ["./app/**/*.{js,jsx}", "./data/**/*.js"],
  theme: {
    extend: {
      // Hall Fiesta poster palette: night navy, bunting teal / red / orange / yellow, lavender, cream
      colors: {
        ink: "#1E2350", bubble: "#E0453A", teal: "#1FA1B3", mustard: "#F6C343", grape: "#2B3166", bone: "#F1EADB",
        rust: "#C33A2F", lav: "#BDB6E6", purple: "#8A3FE6", leaf: "#27A549", orange: "#F39B2E", night: "#262B57",
      },
      // slab and type map to the same two poster fonts, so older class names still work
      fontFamily: { display: ["var(--font-display)", "sans-serif"], slab: ["var(--font-display)", "sans-serif"], type: ["var(--font-body)", "sans-serif"], body: ["var(--font-body)", "sans-serif"] },
    },
  },
  plugins: [],
};
