const path = require('path')
const WriteFilePlugin = require('write-file-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')
const merge = require('webpack-merge')

const common = require('./webpack.common.js')

module.exports = (env, argv) => (merge(common(env, argv), {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new ExtensionReloader(),
    new WriteFilePlugin(),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: '[name].js',
  },
}))
