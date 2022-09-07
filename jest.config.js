// set consistent timezone
process.env.TZ = 'GMT';

/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

const esModules = ['firebase', '@firebase'].join('|');

module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,

  collectCoverageFrom: ['src/**/*.js'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/'],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    // these should match sonar !
    global: {
      branches: 65,
      functions: 80,
      lines: 65,
      statements: 80,
    },
    // TODO FIXME - someday we will have per file coverage that matches sonar :(
    './src/**/*.js': {
      // per file
      branches: 0,
      functions: 25,
      lines: 64,
      statements: 60,
    },
  },

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/tests/__mocks__/mock.js',
  },

  reporters: [
    'default',
    // 'jest-nyancat-reporter',    'jest-junit',
    'jest-skipped-reporter',
    ['jest-slow-test-reporter', { numTests: 3, warnOnSlowerThan: 300, color: true }],
  ],

  setupFilesAfterEnv: ['./tests/jest.setup.js', './node_modules/jest-enzyme/lib/index.js'],

  watchman: true,

  verbose: true,

  transformIgnorePatterns: [`/node_modules/(?!(${esModules}|.*.mjs$))`],
};
