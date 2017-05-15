'use strict';

const tap = require('tap');

const jstp = require('../..');

const testCases = require('../fixtures/serde.test-cases');

testCases.serde.concat(testCases.serialization).forEach((testCase) => {
  tap.strictSame(jstp.stringify(testCase.value), testCase.serialized,
    `must serialize ${testCase.name}`);
});

testCases.serde.concat(testCases.deserialization).forEach((testCase) => {
  tap.strictSame(jstp.parse(testCase.serialized), testCase.value,
    `must deserialize ${testCase.name}`);
});

testCases.invalidDeserialization.forEach((testCase) => {
  tap.throws(() => jstp.parse(testCase.serialized),
    `must not allow ${testCase.name}`);
});
