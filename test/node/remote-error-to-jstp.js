'use strict';

const test = require('tap').test;

const jstp = require('../..');
const RemoteError = jstp.RemoteError;

const testCases = require('../fixtures/remote-error-test-cases');

testCases.forEach(testCase => {
  const error = new RemoteError(testCase.code, testCase.message, testCase.info);
  const jstpArray = error.toJSTP();
  const expectedJstpArray = [testCase.expectedCode];
  if (!RemoteError.defaultMessages[testCase.code] && testCase.message) {
    expectedJstpArray.push(testCase.expectedMessage);
    if (testCase.info) {
      expectedJstpArray.push(testCase.expectedInfo);
    }
  }

  test(`Must properly construct jstp array from error with ${testCase.name}`, test => {
    test.strictSame(jstpArray, expectedJstpArray);
    test.end();
  });
});

test('Must warn about toJstpArray() method deprecation', test => {
  test.plan(2);
  process.once('warning', warning => {
    test.strictSame(warning.name, 'DeprecationWarning');
    test.strictSame(
      warning.message,
      'toJstpArray() method is deprecated, use toJSTP() instead'
    );
  });
  const error = new RemoteError(1);
  error.toJstpArray();
});

class CustomRemoteError extends RemoteError {
  toJstpArray() {
    return [1, 'custom remote error'];
  }
}

test('Must warn about deprecation of toJstpArray() method override', test => {
  test.plan(4);
  process.once('warning', warning => {
    test.strictSame(warning.name, 'DeprecationWarning');
    test.strictSame(
      warning.message,
      'toJstpArray() method is deprecated, implement toJSTP() instead'
    );
  });
  const error = new CustomRemoteError(0);
  const jstpArray = error.toJstpArray();
  const jstpValue = error.toJSTP();
  const expectedJstpArray = [1, 'custom remote error'];
  test.strictSame(jstpArray, expectedJstpArray);
  test.strictSame(jstpValue, expectedJstpArray);
});
