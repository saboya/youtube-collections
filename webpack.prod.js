const path = require('path')
const merge = require('webpack-merge')

const common = require('./webpack.common.js')

module.exports = (env, argv) => (merge(common(env, argv), {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
  },
}))
