'use strict';

const tap = require('tap');

const jstp = require('../../');
const RemoteError = jstp.RemoteError;

const testCases =
  require('../fixtures/remote-error-test-cases/get-jstp-array');

testCases.forEach((testCase) => {
  const arr = RemoteError.getJstpArrayFor(testCase.value);
  tap.strictSame(arr, testCase.expected,
    `Must properly create an array from ${testCase.name}`);
});
