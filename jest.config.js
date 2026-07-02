/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Mirror the tsconfig "@/*" path alias (Jest doesn't use Metro's resolver).
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Unit-test the pure logic layers; skip the export-check bundle output.
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.expo/'],
};
