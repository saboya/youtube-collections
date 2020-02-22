const ChromeManifestGeneratorPlugin = require('webpack-chrome-manifest-generator-plugin').default
const pkg = require('./package.json')

// chromium --load-extension=path/to/extension

module.exports = (env, _) => ({
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
        loader: require.resolve('ts-loader'),
        options: {
          compilerOptions: {
            declaration: env === 'development',
          },
        },
      },
      { /* css non-modules */
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
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
        loader: require.resolve('url-loader'),
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
      content_security_policy: 'script-src \'self\' \'unsafe-eval\'; object-src \'self\'',
    }),
  ],
})
