'use strict';

const util = require('util');

const errors = {};
module.exports = errors;

// Standard protocol errors

errors.ERR_APP_NOT_FOUND = 10;
errors.ERR_AUTH_FAILED = 11;
errors.ERR_INTERFACE_NOT_FOUND = 12;
errors.ERR_INTERFACE_INCOMPATIBLE = 13;
errors.ERR_METHOD_NOT_FOUND = 14;
errors.ERR_NOT_A_SERVER = 15;
errors.ERR_INTERNAL_API_ERROR = 16;
errors.ERR_INVALID_SIGNATURE = 17;

// JSTP remote error class
// TODO: implement RPC stacktrace
//   code - error code
//   message - optional error message
//
function RemoteError(code, message) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, RemoteError);
  } else {
    this.stack = new Error(message).stack;
  }

  this.message = message ||
    RemoteError.defaultMessages[code] ||
    code.toString();

  this.code = code;
}

util.inherits(RemoteError, Error);
errors.RemoteError = RemoteError;

RemoteError.prototype.name = 'RemoteError';

// Convert a RemoteError instance to array representing an error in JSTP
// packets
//
RemoteError.prototype.toJstpArray = function() {
  const isMessagePresent = this.message &&
    this.message !== this.code.toString();
  const isMessageStandard =
    RemoteError.defaultMessages.hasOwnProperty(this.code);

  if (isMessagePresent && !isMessageStandard) {
    return [this.code, this.message];
  } else {
    return [this.code];
  }
};

// Factory method that creates a RemoteError instance from a JSTP array
//   array - array in the form of [code, description]
//
RemoteError.fromJstpArray = array => new RemoteError(array[0], array[1]);

// Prepare an error to be sent in a JSTP packet
//   error - an error to prepare (instance of Error, RemoteError, a string or
//           a regular JavaScript array of error code and error description)
//
RemoteError.getJstpArrayFor = (error) => {
  if (error instanceof RemoteError) {
    return error.toJstpArray();
  } else if (Array.isArray(error)) {
    return error;
  } else if (typeof(error) === 'number') {
    return [error];
  } else if (typeof(error) === 'string') {
    return [1, error];
  } else {
    return [1, error.toString()];
  }
};

// Default messages for predefined error codes
//
RemoteError.defaultMessages = {
  [errors.ERR_APP_NOT_FOUND]:          'Application not found',
  [errors.ERR_AUTH_FAILED]:            'Authentication failed',
  [errors.ERR_INTERFACE_NOT_FOUND]:    'Interface not found',
  [errors.ERR_INTERFACE_INCOMPATIBLE]: 'Incompatible interface',
  [errors.ERR_METHOD_NOT_FOUND]:       'Method not found',
  [errors.ERR_NOT_A_SERVER]:           'Not a server',
  [errors.ERR_INTERNAL_API_ERROR]:     'Internal API error',
  [errors.ERR_INVALID_SIGNATURE]:      'Invalid signature',
};
