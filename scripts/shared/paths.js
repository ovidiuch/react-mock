// NOTE: This is a CommonJS module so .eslintrc can import it.
// @flow

const { join } = require('path');

exports.ROOT_PATH = join(__dirname, '../../');

exports.TEST_GLOBS = [
  '**/__mocks__/**/*.js',
  '**/__tests__/**/*.js',
  '**/*.test.js',
  '**/test.js'
];
