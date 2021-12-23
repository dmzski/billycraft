const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const ENVS = {
  DEV: 'development',
  PROD: 'production',
}

const { env } = process
const PUBLIC_PATH = path.resolve(__dirname, 'public')
const BUILD_PATH = path.resolve(__dirname, 'build')
const isDev = !env.NODE_ENV || env.NODE_ENV === ENVS.DEV

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  cache: isDev
    ? {
        type: 'filesystem',
      }
    : undefined,
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js',
    publicPath: '/',
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheCompression: false,
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: './src',
      }),
    ],
  },
  plugins: [
    isDev ? new ReactRefreshWebpackPlugin() : false,
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: !isDev }),
  ].filter(Boolean),
  devServer: {
    allowedHosts: 'all',
    static: {
      directory: PUBLIC_PATH,
    },
    historyApiFallback: true,
    port: 3000,
    hot: 'only',
    compress: true,
    open: true,
  },
}
