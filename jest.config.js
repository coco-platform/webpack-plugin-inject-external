module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  // Coverage report
  collectCoverageFrom: ['lib/**/*.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'html'],
  // Test configuration
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.spec.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/__fixture__/'],
};
