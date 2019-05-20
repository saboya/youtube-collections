const path = require('path')
const ChromeManifestGeneratorPlugin = require('webpack-chrome-manifest-generator-plugin').default
const pkg = require('./package.json')
const WriteFilePlugin = require('write-file-webpack-plugin')

// chromium --load-extension=path/to/extension

module.exports = (env, argv) => ({
  target: 'web',
  entry: {
    'main': './src/main.tsx',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declaration: env === 'development',
          },
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      { /* css non-modules */
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: env === 'development',
            },
          },
        ],
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
})
