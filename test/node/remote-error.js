'use strict';

const tap = require('tap');

const jstp = require('../../');
const RemoteError = jstp.RemoteError;

const testCases = require('../fixtures/remote-error-test-cases');

const checkError = (error, code, message) => {
  tap.type(error, Error);
  tap.strictSame(error.name, 'RemoteError');
  tap.type(error, RemoteError);
  tap.strictSame(error.code, code);
  tap.strictSame(error.message, message);
};

tap.includes(Object.keys(RemoteError.defaultMessages), testCases.errorMessages);

testCases.remoteError.forEach((testCase) => {
  const error = new RemoteError(testCase.code, testCase.message);
  checkError(error, testCase.expectedCode, testCase.expectedMessage);
});

testCases.remoteError.forEach((testCase) => {
  const error = new RemoteError(testCase.code, testCase.message);
  const jstpArray = error.toJstpArray();
  const expextedJstpArray = [testCase.expectedCode];
  if (!RemoteError.defaultMessages[testCase.code] && testCase.message) {
    expextedJstpArray.push(testCase.expectedMessage);
  }
  tap.strictSame(jstpArray, expextedJstpArray);
});

testCases.remoteError.forEach((testCase) => {
  const jstpArray = [testCase.code];
  if (testCase.message) {
    jstpArray.push(testCase.message);
  }
  const error = RemoteError.fromJstpArray(jstpArray);
  checkError(error, testCase.expectedCode, testCase.expectedMessage);
});

testCases.getJstpArray.forEach((testCase) => {
  const arr = RemoteError.getJstpArrayFor(testCase.value);
  tap.strictSame(arr, testCase.expected);
});
