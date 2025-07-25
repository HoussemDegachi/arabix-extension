/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./components/*.tsx", "./popup.tsx"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        main: "#4a7dff",
        labels: "#91949c",
        graph_cyan_1: "#41d5de",
        graph_cyan_2: "#39afea",
      },
      spacing: {
        py_base: "14px",
        py_small: "6px",
        px_base: "18px"
      }
    }
  }
}

