const path = require('path');
const webpack = require("webpack");

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/frontend/index.js',
  output: {
    filename: 'bundle.[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {test: /\.vue$/, use: 'vue-loader'},
      {test: /\.css$/, use: ['vue-style-loader', 'css-loader', 'postcss-loader']},
      {test: /\.scss$/, use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader']},
      {test: /\.svg$/, use: {loader: 'vue-svg-loader', options: {svgo: {plugins: [{removeViewBox: false}]}}}}
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js'
    },
    extensions: [
      '.vue',
      '.js'
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {from: 'public', to: 'static'}
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/frontend/index.html',
    }),
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'MAPBOX_TOKEN': process.env.MAPBOX_TOKEN
    })
  ],
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
};