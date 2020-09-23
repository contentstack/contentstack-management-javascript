
const packages = require('../package.json')
const webpack = require('webpack')

module.exports = function () {
  return {
    entry: {
      contentstack: './lib/contentstack'
    },
    resolve: {
      extensions: ['.js']
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
          query: {
            search: '{{VERSION}}',
            replace: packages.version
          }
        }
        ]
      }]
    },
    plugins: [
      new webpack.IgnorePlugin(/vertx/)
    ]
  }
}
