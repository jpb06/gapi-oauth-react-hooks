module.exports = {
  preset: "ts-jest",
  testEnvironment: "<rootDir>/jest.environment.js",
  coverageReporters: [
    "json-summary",
    "text",
    "lcov"
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/dist/",
    "!<rootDir>/src/index.ts",
    "!<rootDir>/src/indirection/**",
    "!<rootDir>/src/tests-related/**"
  ],
  modulePathIgnorePatterns: ['<rootDir>/dist']
};