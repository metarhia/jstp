'use strict';

const tap = require('tap');
const jstp = require('../..');

const testCases = require('../fixtures/message-parser');

testCases.forEach((testCase) => {
  const result = [];
  const remainder = jstp.parseNetworkPackets(testCase.message, result);
  tap.strictSame(result, testCase.result,
    `must properly parse ${testCase.name}`);
  tap.strictSame(remainder, testCase.remainder,
    `must leave a valid remainder after parsing ${testCase.name}`);
});
