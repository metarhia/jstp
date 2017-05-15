'use strict';

const tap = require('tap');
const jstp = require('../..');

const testCases = require('../fixtures/message-parser');

testCases.forEach((testCase) => {
  const result = [];
  const reminder = jstp.parseNetworkPackets(testCase.message, result);
  tap.strictSame(result, testCase.result,
    `must properly parse ${testCase.name}`);
  tap.strictSame(reminder, testCase.reminder,
    `must leave a valid reminder after parsing ${testCase.name}`);
});
