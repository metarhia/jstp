'use strict';

const test = require('tap').test;

const jstp = require('../..');
const RemoteError = jstp.RemoteError;

const testCases = require('../fixtures/remote-error-test-cases');

testCases.forEach((testCase) => {
  const error = new RemoteError(testCase.code, testCase.message);
  const jstpArray = error.toJstpArray();
  const expextedJstpArray = [testCase.expectedCode];
  if (!RemoteError.defaultMessages[testCase.code] && testCase.message) {
    expextedJstpArray.push(testCase.expectedMessage);
  }

  test(`Must properly construct jstp array from error with ${testCase.name}`,
    (test) => {
      test.strictSame(jstpArray, expextedJstpArray);
      test.end();
    });
});
