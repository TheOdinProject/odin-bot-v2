module.exports = {
  globalSetup: './test/global-setup.js',
  testEnvironment: 'node',
  transformIgnorePatterns: ['/node_modules/(?!axios)'],
};
