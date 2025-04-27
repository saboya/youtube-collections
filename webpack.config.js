import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ChromeManifestGeneratorPlugin from'webpack-chrome-manifest-generator-plugin'
import pkg from './package.json' with { type: "json" }
import ExtReloader from 'webpack-ext-reloader'

process.traceDeprecation = true
// chromium --load-extension=path/to/extension

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('webpack').Configuration} */
const config = (env, _argv) => ({
  target: 'web',
  entry: {
    'content-script': './src/main.tsx',
    background: './src/background.ts',
  },
  infrastructureLogging: {
    debug: [
      (name) => {
        return name === 'ChromeManifestGenerator'
      },
    ],
  },
  stats: {
    logging: 'info',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css'],
  },
  devtool: 'inline-source-map',
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
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
    new ExtReloader(),
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
  output: {
    path: join(__dirname, "dist"),
    filename: '[name].js',
  },
})

export default config
