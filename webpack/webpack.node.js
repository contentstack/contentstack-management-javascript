const path = require('path')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.common')

module.exports = function (options) {
  return webpackMerge(commonConfig(), {
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, '../dist/node'),
      filename: 'contentstack-management.js'
    },
    target: 'node',
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
