'use strict';

const test = require('tap').test;

const jstp = require('../..');
const RemoteError = jstp.RemoteError;

const testCases = require('../fixtures/remote-error-test-cases');

testCases.forEach(testCase => {
  test(`Must properly construct an error with ${testCase.name}`, test => {
    const error = new RemoteError(testCase.code, testCase.message);
    test.type(error, Error, 'must be an error');
    test.type(error, RemoteError, 'must be a RemoteError');
    test.strictSame(error.name, 'RemoteError', "must be named 'RemoteError'");
    test.strictSame(
      error.code,
      testCase.expectedCode,
      'must have an code equal to code passed as argument'
    );
    test.strictSame(
      error.message,
      testCase.expectedMessage,
      'must have an message equal to message passed as argument'
    );
    test.end();
  });
});
