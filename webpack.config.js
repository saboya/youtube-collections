const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ChromeManifestGeneratorPlugin = require('webpack-chrome-manifest-generator-plugin').default
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
    new ChromeManifestGeneratorPlugin({
      name: 'Youtube Collections',
      package: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
      },
    }),
    new WriteFilePlugin(),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: '[name].js',
  },
}
