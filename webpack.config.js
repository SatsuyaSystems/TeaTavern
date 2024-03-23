const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: './src/scss/base.scss', // Your main SCSS entry file
  output: {
    // This will output a minimal JS file, which is a side effect of how Webpack handles entry files.
    // You might not use this JS file if you're only interested in the CSS output.
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'src'), // Consider outputting to a 'dist' folder
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', // Translates CSS into CommonJS
          'sass-loader' // Compiles Sass to CSS
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../assets/css/styles.css', // The single CSS file output
    }),
  ],
};
