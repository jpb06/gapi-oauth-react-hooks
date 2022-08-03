/** @type {import('@jest/types').Config.InitialOptions} */

module.exports = {
  logHeapUsage: true,
  testEnvironment: '<rootDir>/jest/jest.environment.js',
  transform: {
    '^.+\\.ts$': ['@swc/jest'],
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/src/index.ts',
    '<rootDir>/src/indirection/',
    '<rootDir>/src/tests-related/',
    '<rootDir>/src/types/',
  ],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  coverageDirectory: './coverage',
  coverageReporters: ['json-summary', 'text', 'lcov'],
};
