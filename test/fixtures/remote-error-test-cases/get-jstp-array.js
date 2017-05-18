'use strict';

const jstp = require('../../../');
const RemoteError = jstp.RemoteError;

const code = jstp.ERR_APP_NOT_FOUND;
const message = 'Custom Message';
const defaultErrorCode = 1;
const sampleObject = { sample: 'Object' };

module.exports = [
  {
    name: 'RemoteError',
    value: new RemoteError(code),
    expected: [code]
  },
  {
    name: 'Array',
    value: [code, message],
    expected: [code, message]
  },
  {
    name: 'error code',
    value: code,
    expected: [code]
  },
  {
    name: 'message',
    value: message,
    expected: [defaultErrorCode, message]
  },
  {
    name: 'Error',
    value: new TypeError('Invalid argument'),
    expected: [defaultErrorCode, 'TypeError: Invalid argument']
  },
  {
    name: 'Object',
    value: sampleObject,
    expected: [defaultErrorCode, sampleObject.toString()]
  }
];
