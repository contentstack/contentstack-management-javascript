module.exports = {
  env: {
    "es2020": true
  },
  extends: 'standard',
  // "globals": {
  //     "Atomics": "readonly",
  //     "SharedArrayBuffer": "readonly"
  // },
  // "parserOptions": {
  //     "ecmaFeatures": {
  //         "jsx": true
  //     },
  //     "ecmaVersion": 2015,
  //     "sourceType": "module"
  // },
  parser: "@babel/eslint-parser", // Use Babel parser to handle modern JS syntax
  plugins: [
    'standard',
    'promise'
  ],
  rules: {
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      rules: {
        'no-unused-expressions': 'off'
      }
    }
  ]
}
