'use strict';

const test = require('tap');

const jstp = require('../..');
const RemoteError = jstp.RemoteError;

const expectedMessages = Object.keys(jstp)
  .filter(key => key.startsWith('ERR_'))
  .map(key => jstp[key].toString());

test.includes(Object.keys(RemoteError.defaultMessages).sort(), expectedMessages,
  'Must have a default message for every predefined error');
