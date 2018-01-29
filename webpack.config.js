const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ChromeExtensionPlugin = require('./chrome-extension-plugin.js')
const pkg = require('./package.json')
const WriteFilePlugin = require('write-file-webpack-plugin')

// chromium --load-extension=path/to/extension

module.exports = {
  entry: {
    simple: './lib/js/src/root.js',
  },
  plugins: [
    new ChromeExtensionPlugin({
      package: pkg,
    }),
    new WriteFilePlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'Youtube Collections',
      template: 'src/index.ejs',
    }),
  ],
  output: {
    path: path.join(__dirname, "bundledOutputs"),
    filename: '[name].js',
  },
}