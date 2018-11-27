'use strict';

// Implementation defined errors
const ERR_CALLBACK_LOST = -1;
const ERR_NO_HANDSHAKE_RESPONSE = -2;

// Standard protocol errors
const ERR_APP_NOT_FOUND = 10;
const ERR_AUTH_FAILED = 11;
const ERR_INTERFACE_NOT_FOUND = 12;
const ERR_INTERFACE_INCOMPATIBLE = 13;
const ERR_METHOD_NOT_FOUND = 14;
const ERR_NOT_A_SERVER = 15;
const ERR_INTERNAL_API_ERROR = 16;
const ERR_INVALID_SIGNATURE = 17;

// Default messages for predefined error codes
const defaultMessages = {
  [ERR_CALLBACK_LOST]:          'Connection closed before receiving callback',
  [ERR_NO_HANDSHAKE_RESPONSE]:  'Connection closed before receiving handshake',
  [ERR_APP_NOT_FOUND]:          'Application not found',
  [ERR_AUTH_FAILED]:            'Authentication failed',
  [ERR_INTERFACE_NOT_FOUND]:    'Interface not found',
  [ERR_INTERFACE_INCOMPATIBLE]: 'Incompatible interface',
  [ERR_METHOD_NOT_FOUND]:       'Method not found',
  [ERR_NOT_A_SERVER]:           'Not a server',
  [ERR_INTERNAL_API_ERROR]:     'Internal API error',
  [ERR_INVALID_SIGNATURE]:      'Invalid signature',
};

// JSTP remote error class
// TODO: implement RPC stacktrace
class RemoteError extends Error {
  //  JSTP RemoteError constructor
  //    code - error code
  //    message - optional error message
  //
  constructor(code, message) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RemoteError);
    } else {
      this.stack = new Error(message).stack;
    }

    this.message = message ||
      defaultMessages[code] ||
      code.toString();

    this.code = code;
  }

  get name() {
    return 'RemoteError';
  }

  // Convert a RemoteError instance to array representing
  // an error in JSTP messages
  //
  toJstpArray() {
    const isMessagePresent = this.message !== this.code.toString();
    const isMessageStandard = defaultMessages.hasOwnProperty(this.code);

    if (isMessagePresent && !isMessageStandard) {
      return [this.code, this.message];
    } else {
      return [this.code];
    }
  }

  // Factory method that creates a RemoteError instance from a JSTP array
  //   array - array in the form of [code, description]
  //
  static fromJstpArray(array) {
    return new RemoteError(array[0], array[1]);
  }

  // Prepare an error to be sent in a JSTP message
  //   error - an error to prepare (instance of Error, RemoteError, a string or
  //           a regular JavaScript array of error code and error description)
  //
  static getJstpArrayFor(error) {
    if (error instanceof RemoteError) {
      return error.toJstpArray();
    } else if (Array.isArray(error)) {
      return error;
    } else if (typeof error === 'number') {
      return [error];
    } else if (typeof error === 'string') {
      return [1, error];
    } else {
      return [1, error.toString()];
    }
  }

  static get defaultMessages() {
    return defaultMessages;
  }
}

module.exports = {
  ERR_CALLBACK_LOST,
  ERR_NO_HANDSHAKE_RESPONSE,
  ERR_APP_NOT_FOUND,
  ERR_AUTH_FAILED,
  ERR_INTERFACE_NOT_FOUND,
  ERR_INTERFACE_INCOMPATIBLE,
  ERR_METHOD_NOT_FOUND,
  ERR_NOT_A_SERVER,
  ERR_INTERNAL_API_ERROR,
  ERR_INVALID_SIGNATURE,
  RemoteError,
};
