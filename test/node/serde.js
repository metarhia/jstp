'use strict';

const tap = require('tap');

const jstp = require('../..');

const testCases = require('../fixtures/testCases');

testCases.serde.concat(testCases.serialization).forEach((testCase) => {
  tap.test(`must serialize ${testCase.name}`, (test) => {
    test.strictSame(jstp.stringify(testCase.value), testCase.serialized);
    test.end();
  });
});

testCases.serde.concat(testCases.deserialization).forEach((testCase) => {
  tap.test(`must deserialize ${testCase.name}`, (test) => {
    test.strictSame(jstp.parse(testCase.serialized), testCase.value);
    test.end();
  });
});

testCases.invalidDeserialization.forEach((testCase) => {
  tap.test(`must not allow ${testCase.name}`, (test) => {
    test.throws(() => jstp.parse(testCase.serialized));
    test.end();
  });
});
