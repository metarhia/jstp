'use strict';

const jstp = require('../..');

const test = require('tap').test;
const testCases = require('../fixtures/todo/serde');

testCases.deserialization.forEach((testCase) => {
  test(`must deserialize ${testCase.name}`, (test) => {
    test.strictSame(jstp.parse(testCase.serialized), testCase.value);
    test.end();
  });
});

testCases.serialization.forEach((testCase) => {
  test(`must serialize ${testCase.name}`, (test) => {
    test.strictSame(jstp.stringify(testCase.value), testCase.serialized);
    test.end();
  });
});
