const { join } = require('path');

module.exports = {
  rootDir: join(__dirname, '..'),
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/packages/fetch/setup-global-fetch.js'],
  // Maybe someday: collectCoverageFrom: [],
  coverageDirectory: '<rootDir>/coverage'
};
