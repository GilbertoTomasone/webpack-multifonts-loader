const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  const mode = env.mode || 'development';
  const isDevelopment = mode === 'development';

  return {
    mode: mode,
    entry: [
      './index.js'
    ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: 'app.bundle.js'
    },
    module: {
      rules: [
        {
          test: /multifonts\.loader\.js/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'multifonts-loader',
              options: {
                icons: {
                  fontFilename: isDevelopment
                    ? '[fontname].[chunkhash].[ext]?[hash]'
                    : '[chunkhash].[ext]?[hash]'
                },
                fonts: {
                  fontFilename: isDevelopment
                    ? '[fontname].[chunkhash].[ext]?[hash]'
                    : '[chunkhash].[ext]?[hash]'
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'app.bundle.[contenthash].css'
      })
    ],
    devServer: {
      compress: true,
      historyApiFallback: true,
      host: 'localhost',
      hot: true,
      https: true,
      inline: true,
      port: '8080'
    },
    resolveLoader: {
      alias: {
        'multifonts-loader': path.resolve(__dirname, '../index')
      }
    }
  };
};
