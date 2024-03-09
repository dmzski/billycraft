module.exports = {
  content: ['./src/**/*.{ts,tsx}', './node_modules/@coco-ui/core/**/*.js', './public/index.html'],
  /* presets: [require('@coco-ui/core/dist/tailwind-theme')], */
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        coco: {
          primary: '#9333ea',

          secondary: '#9ca3af',

          accent: '#e879f9',

          neutral: '#3D4451',

          'base-100': '#FFFFFF',

          info: '#3b82f6',

          success: '#22c55e',

          warning: '#facc15',

          error: '#ef4444',
        },
      },
    ],
  },
}
