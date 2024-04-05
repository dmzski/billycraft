module.exports = {
  content: ['./src/**/*.{ts,tsx}', './node_modules/@coco-ui/core/**/*.js', './public/index.html'],
  /* presets: [require('@coco-ui/core/dist/tailwind-theme')], */
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      'fantasy'
    ],
  },
}
