const path = require('path')
const { merge } = require('webpack-merge')

const commonConfig = require('./webpack.common.js')

module.exports = function (options) {
  return merge(commonConfig(), {
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, '../dist/react-native'),
      filename: 'contentstack-management.js'
    },
    resolve: {
      fallback: {
        os: false
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
