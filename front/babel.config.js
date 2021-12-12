const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

module.exports = {
  presets: [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    isDev ? 'react-refresh/babel' : false,
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ].filter(Boolean),
}
