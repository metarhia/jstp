'use strict';

const jstp = require('../../../');
const RemoteError = jstp.RemoteError;

const knownErrorCode = jstp.ERR_APP_NOT_FOUND;
const customMessage = 'Custom Message';
const defaultMessage = RemoteError.defaultMessages[knownErrorCode];
const unknownErrorCode = 42;
const unknownMessage = 'Unknown Message';

module.exports = [
  {
    name: 'known error code and custom message',
    code: knownErrorCode,
    message: customMessage,
    expectedCode: knownErrorCode,
    expectedMessage: customMessage
  },
  {
    name: 'known errorCode and no message',
    code: knownErrorCode,
    expectedCode: knownErrorCode,
    expectedMessage: defaultMessage
  },
  {
    name: 'unknown error code and custom message',
    code: unknownErrorCode,
    message: unknownMessage,
    expectedCode: unknownErrorCode,
    expectedMessage: unknownMessage
  },
  {
    name: 'unknown error code and no message',
    code: unknownErrorCode,
    expectedCode: unknownErrorCode,
    expectedMessage: unknownErrorCode.toString()
  }
];
