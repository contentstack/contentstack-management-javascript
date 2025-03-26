'use strict'

const path = require('path')
const { merge } = require('webpack-merge')

const commonConfig = require('./webpack.common.js')()

module.exports = function (options) {
  delete commonConfig.externals
  return merge(commonConfig, {
    output: {
      libraryTarget: 'umd',
      path: path.join(__dirname, '../dist/web'),
      filename: 'contentstack-management.js'
    },
    resolve: {
      fallback: {
        os: require.resolve('os-browserify/browser'),
        fs: false,
        crypto: false,
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer')
      },
    },
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: ['/node_modules'],
        use: [{
          loader: 'string-replace-loader',
          options: {
            search: '{{PLATFORM}}',
            replace: 'web'
          }
        }]
      }]
    }
  })
}
