// tailwind.config.js
module.exports = {
  daisyui: {
    themes: ["light", "dark"],
  },
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React files
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
