'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const license = fs.readFileSync(path.join(__dirname, 'LICENSE')).toString();

module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'jstp.umd.js',
    sourceMapFilename: 'jstp.umd.js.map',
    libraryTarget: 'umd',
    library: ['api', 'jstp'],
  },
  devtool: 'source-map',
  bail: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: license,
    }),
  ],
  node: {
    net: false,
    tls: false,
    crypto: 'empty',
  },
};
