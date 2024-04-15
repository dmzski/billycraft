module.exports = {
  content: ['./src/**/*.{ts,tsx}', './node_modules/@coco-ui/core/**/*.js', './public/index.html'],
  /* presets: [require('@coco-ui/core/dist/tailwind-theme')], */
  plugins: [require('daisyui')],
  daisyui: {
    themes: [{
      mytheme: {
        ...require("daisyui/src/theming/themes")["light"],
        "primary": "#3730a3",
        "secondary": "#0e7490",
        "accent": "#c026d3",
        "neutral": "#dbeafe",
        "base-100": "#ffffff",
        "info": "#38bdf8",
        "success": "#4ade80",
        "warning": "#fde047",
        "error": "#f43f5e",
      }
    }],
  },
}
