const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: './src/scss/base.scss',
  output: {
    filename: 'js/bundle.js', // This will place a minimal JS bundle in ./assets/js/
    path: path.resolve(__dirname, 'assets'),
    publicPath: '/assets/',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // Enable source maps for better debugging
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.css', // Compiles SCSS to CSS in ./assets/css/
    }),
  ],
};
