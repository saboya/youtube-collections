const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ChromeManifestPlugin = require('./chrome-manifest-plugin/index.js')
const pkg = require('./package.json')
const WriteFilePlugin = require('write-file-webpack-plugin')

// chromium --load-extension=path/to/extension

module.exports = {
  target: 'web',
  entry: () => {},
  plugins: [
    new ChromeManifestPlugin({
      backgroundScriptsDir: 'lib/js/src/background_scripts',
      contentScriptsDir: 'lib/js/src/content_scripts',
      name: 'Youtube Collections',
      package: pkg
    }),
    new WriteFilePlugin(),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: '[name]',
  },
}