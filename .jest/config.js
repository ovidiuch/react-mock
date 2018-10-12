const { join } = require('path');

module.exports = {
  rootDir: join(__dirname, '..'),
  setupFiles: ['<rootDir>/packages/fetch/setup-global-fetch.js'],
  // TODO: collectCoverageFrom: [],
  coverageDirectory: '<rootDir>/coverage'
};
