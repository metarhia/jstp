'use strict';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const license = fs.readFileSync(path.join(__dirname, 'LICENSE')).toString();

module.exports = {
  entry: [
    'babel-polyfill',
    './jstp'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'jstp.min.js',
    sourceMapFilename: 'jstp.min.js.map',
    libraryTarget: 'assign',
    library: ['api', 'jstp']
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    }]
  },
  devtool: 'source-map',
  bail: true,
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    new webpack.BannerPlugin({
      banner: license
    })
  ]
};
