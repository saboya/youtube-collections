const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    simple: './lib/js/src/root.js',
  },
  plugins: [
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
};