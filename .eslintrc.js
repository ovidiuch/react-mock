const { TEST_GLOBS } = require('./scripts/shared/paths');

module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:flowtype/recommended'
  ],
  env: {
    'shared-node-browser': true,
    commonjs: true,
    es6: true
  },
  settings: {
    react: {
      version: '16.5'
    }
  },
  rules: {
    'spaced-comment': 2,
    'no-console': 1,
    // I don't believe in default exports anymore
    'import/default': 0,
    'react/prop-types': 1,
    'react/no-unescaped-entities': 1,
    // flowtype/generic-spacing conflicts with Prettier
    'flowtype/generic-spacing': 0
  },
  overrides: [
    {
      files: ['.jest/*.js', ...TEST_GLOBS, 'scripts/templates/tests.js'],
      env: {
        jest: true
      }
    },
    {
      files: ['scripts/**/*.js'],
      env: {
        node: true
      },
      rules: {
        'no-console': 0
      }
    }
  ]
};
