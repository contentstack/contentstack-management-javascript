const path = require('path')
const { merge } = require('webpack-merge')

const commonConfig = require('./webpack.common.js')

module.exports = function (options) {
  return merge(commonConfig(), {
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, '../dist/nativescript'),
      filename: 'contentstack-management.js'
    },
    resolve: {
      fallback: {
        os: false,
        crypto: false,
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        path: require.resolve('path-browserify')
      }
    },
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: ['/node_modules'],
        use: [{
          loader: 'string-replace-loader',
          options: {
            search: '{{PLATFORM}}',
            replace: 'react-native'
          }
        }]
      }]
    }
  })
}
