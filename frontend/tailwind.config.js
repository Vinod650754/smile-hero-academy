/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tealHero: "#0d9488",
        yellowHero: "#ffd166",
        navyHero: "#18324b",
        mintBg: "#dff8ef",
        skyBg: "#e6f6ff",
        coralHero: "#ff7b7b"
      },
      fontFamily: {
        rounded: ['ui-rounded', '"Trebuchet MS"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}