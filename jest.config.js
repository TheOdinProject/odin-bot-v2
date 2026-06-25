module.exports = {
  globalSetup: './test/global-setup.js',
  globalTeardown: './test/global-teardown.js',
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/(?!axios)'],
};
