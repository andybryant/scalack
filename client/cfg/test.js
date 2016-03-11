'use strict';

let path = require('path');
let srcPath = path.join(__dirname, '/../src/');

let baseConfig = require('./base');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

module.exports = {
  devtool: 'eval',
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'isparta-instrumenter-loader',
        include: [
          path.join(__dirname, '/../src')
        ]
      }
    ],
    loaders: [
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [].concat(
          baseConfig.additionalPaths,
          [
            path.join(__dirname, '/../src'),
            path.join(__dirname, '/../test')
          ]
        )
      }
    ]
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    alias: {
      helpers: path.join(__dirname, '/../test/helpers'),
      action: srcPath + 'action/',
      component: srcPath + 'component/',
      constants: srcPath + 'constants/',
      container: srcPath + 'container/',
      data: srcPath + 'data/',
      model: srcPath + 'model/',
      reducer: srcPath + 'reducer/',
      service: srcPath + 'service/',
      signal: srcPath + 'signal/',
      store: srcPath + 'store/',
      styles: srcPath + 'styles/',
      type: srcPath + 'type/',
      util: srcPath + 'util/',
      config: srcPath + 'config/' + process.env.REACT_WEBPACK_ENV,
    }
  },
  plugins: [
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ]
};
