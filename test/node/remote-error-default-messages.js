'use strict';

const tap = require('tap');

const jstp = require('../../');
const RemoteError = jstp.RemoteError;

const expectedMessages =
  require('../fixtures/remote-error-test-cases/default-messages');

tap.includes(Object.keys(RemoteError.defaultMessages), expectedMessages,
  'Must have a default message for every predefined error');
