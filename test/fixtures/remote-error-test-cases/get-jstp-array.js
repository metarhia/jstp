'use strict';

const jstp = require('../../../');
const RemoteError = jstp.RemoteError;

const remoteErrorTestCases = require('./remote-error');

const defaultErrorCode = 1;

const sampleObject = { sample: 'Object' };

module.exports = [
  {
    value: new TypeError('Invalid argument'),
    expected: [defaultErrorCode, 'TypeError: Invalid argument']
  },
  {
    value: sampleObject,
    expected: [1, sampleObject.toString()]
  }
];

remoteErrorTestCases.forEach((testCase) => {
  const error = new RemoteError(testCase.code, testCase.message);
  module.exports.push({
    value: error,
    expected: error.toJstpArray()
  });

  module.exports.push({
    value: testCase.code,
    expected: [testCase.code]
  });

  const array = [testCase.code];
  if (testCase.message) {
    array.push(testCase.message);
  }
  module.exports.push({
    value: array,
    expected: array
  });

  if (testCase.message) {
    module.exports.push({
      value: testCase.message,
      expected: [1, testCase.message]
    });
  }
});
