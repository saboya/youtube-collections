const path = require('path')
const ChromeManifestGeneratorPlugin = require('webpack-chrome-manifest-generator-plugin').default
const pkg = require('./package.json')
const WriteFilePlugin = require('write-file-webpack-plugin')
const ExtensionReloader  = require('webpack-extension-reloader')

// chromium --load-extension=path/to/extension

module.exports = (env, argv) => ({
  target: 'web',
  entry: {
    'content-script': './src/main.tsx',
    background: './src/background.ts',
  },
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
    new ExtensionReloader(),
    new ChromeManifestGeneratorPlugin({
      name: 'Youtube Collections',
      package: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
      },
      content_security_policy: 'script-src \'self\' \'unsafe-eval\'; object-src \'self\'',
    }),
    new WriteFilePlugin(),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: '[name].js',
  },
})
