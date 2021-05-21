module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // or 'media' or 'class'
  presets: [require("@coco-ui/core/dist/tailwind-theme")],
};
