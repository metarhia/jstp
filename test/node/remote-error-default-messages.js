'use strict';

const test = require('tap').test;

const jstp = require('../..');
const RemoteError = jstp.RemoteError;

const expectedMessages = Object.keys(jstp)
  .filter(key => key.startsWith('ERR_'))
  .map(key => jstp[key].toString());

test('Must have a default message for every predefined error', (test) => {
  test.includes(Object.keys(RemoteError.defaultMessages), expectedMessages);
  test.end();
});
