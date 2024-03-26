
const packages = require('../package.json')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = function () {
  return {
    entry: {
      contentstack: './lib/contentstack'
    },
    resolve: {
      extensions: ['.js'],
      modules: [
        '../lib',
        'node_modules'
      ]
    },
    externals: { fs: 'commonjs fs' },
    module: {
      rules: [{
        test: /\.js?$/,
        exclude: ['/node_modules'],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        {
          loader: 'string-replace-loader',
          options: {
            search: '{{VERSION}}',
            replace: packages.version
          }
        }
        ]
      }]
    },
    plugins: [
      new webpack.WatchIgnorePlugin({
        paths: [/vertx/]
      }),
      new CleanWebpackPlugin({
        protectWebpackAssets: false,
        cleanAfterEveryBuildPatterns: ['*.LICENSE.txt']
      })
    ]
  }
}
