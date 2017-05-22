'use strict';

const tap = require('tap');

const jstp = require('../../');
const RemoteError = jstp.RemoteError;

const expectedMessages = Object.keys(jstp)
  .filter(key => key.startsWith('ERR_'))
  .map(key => jstp[key].toString());

tap.includes(Object.keys(RemoteError.defaultMessages), expectedMessages,
  'Must have a default message for every predefined error');
