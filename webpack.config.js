const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ChromeManifestPlugin = require('./chrome-manifest-plugin/index.js')
const pkg = require('./package.json')
const WriteFilePlugin = require('write-file-webpack-plugin')

// chromium --load-extension=path/to/extension

module.exports = {
  target: 'web',
  entry: {
    "default": './lib/js/src/scripts/default.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
      },
    ],
  },
  plugins: [
    new ChromeManifestPlugin({
      name: 'Youtube Collections',
      package: pkg
    }),
    new WriteFilePlugin(),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: '[name].js',
  },
}
