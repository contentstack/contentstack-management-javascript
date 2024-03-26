var plugins = [
    'transform-object-rest-spread',
    'lodash',
    ['inline-replace-variables', {
      // Inject version number into code
      '__VERSION__': require('./package.json').version
    }]
  ]


function babelConfig ()  {
  return plugins
}
module.exports = babelConfig
