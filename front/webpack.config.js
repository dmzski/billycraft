const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const pkg = require('./package.json')
const { DefinePlugin } = require('webpack')

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
    new DefinePlugin({
      'process.env.VERSION': JSON.stringify(pkg.version),
      'process.env.API_URL': JSON.stringify(process.env.NODE_ENV === "production" ? "https://api.coco-erp.fr/api/v1" : "http://api.coco-erp.lan/api/v1")
    }),
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
