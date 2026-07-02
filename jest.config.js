/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],
  // Unit-test the pure logic layers; skip the export-check bundle output.
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/.expo/'],
};
