const path = require('path')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')

module.exports = function (options) {
  return merge(commonConfig(), {
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, '../dist/node'),
      filename: 'contentstack-management.js'
    },
    target: 'node',
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
            replace: 'nodejs'
          }
        }]
      }]
    }
  })
}
