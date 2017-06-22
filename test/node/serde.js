'use strict';

const test = require('tap').test;

const jstp = require('../..');

const testCases = require('../fixtures/serde-test-cases');

testCases.serde.concat(testCases.serialization).forEach((testCase) => {
  test(`must serialize ${testCase.name}`, (test) => {
    test.strictSame(jstp.stringify(testCase.value), testCase.serialized);
    test.end();
  });
});

testCases.serde.concat(testCases.deserialization).forEach((testCase) => {
  test(`must deserialize ${testCase.name}`, (test) => {
    test.strictSame(jstp.parse(testCase.serialized), testCase.value);
    test.end();
  });
});

testCases.invalid.forEach((testCase) => {
  test(`must not allow ${testCase.name}`, (test) => {
    test.throws(() => jstp.parse(testCase.value));
    test.end();
  });
});
