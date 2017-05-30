'use strict';

module.exports = (config) => {
  const configuration = {
    basePath: '',
    frameworks: ['mocha', 'detectBrowsers'],
    files: [
      { pattern: 'test/unit/*.test.js', watched: false },
      { pattern: 'test/unit/**/*.test.js', watched: false }
    ],
    exclude: [
      'test/unit/server.test.js'
    ],
    preprocessors: {
      'test/unit/*.test.js': ['webpack'],
      'test/unit/**/*.test.js': ['webpack']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [],
    webpack: {},
    webpackMiddleware: {
      stats: 'errors-only'
    },
    detectBrowsers: {
      usePhantomJS: false
    },
    singleRun: true,
    concurrency: Infinity
  };

  if (process.env.TRAVIS) {
    configuration.frameworks.pop();
    configuration.browsers = ['Firefox'];
  }

  config.set(configuration);
};
