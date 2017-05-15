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
    code: knownErrorCode,
    message: customMessage,
    expectedCode: knownErrorCode,
    expectedMessage: customMessage
  },
  {
    code: knownErrorCode,
    expectedCode: knownErrorCode,
    expectedMessage: defaultMessage
  },
  {
    code: unknownErrorCode,
    message: unknownMessage,
    expectedCode: unknownErrorCode,
    expectedMessage: unknownMessage
  },
  {
    code: unknownErrorCode,
    expectedCode: unknownErrorCode,
    expectedMessage: unknownErrorCode.toString()
  }
];
