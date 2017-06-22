'use strict';

const jstp = require('../..');

const test = require('tap').test;
const testCases = require('../fixtures/todo/serde/serialization');

testCases.forEach((testCase) => {
  test(`must serialize ${testCase.name}`, (test) => {
    test.strictSame(jstp.stringify(testCase.value), testCase.serialized);
    test.end();
  });
});
