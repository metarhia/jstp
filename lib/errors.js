'use strict';

const deprecate = require('./deprecate');

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
  [ERR_CALLBACK_LOST]: 'Connection closed before receiving callback',
  [ERR_NO_HANDSHAKE_RESPONSE]: 'Connection closed before receiving handshake',
  [ERR_APP_NOT_FOUND]: 'Application not found',
  [ERR_AUTH_FAILED]: 'Authentication failed',
  [ERR_INTERFACE_NOT_FOUND]: 'Interface not found',
  [ERR_INTERFACE_INCOMPATIBLE]: 'Incompatible interface',
  [ERR_METHOD_NOT_FOUND]: 'Method not found',
  [ERR_NOT_A_SERVER]: 'Not a server',
  [ERR_INTERNAL_API_ERROR]: 'Internal API error',
  [ERR_INVALID_SIGNATURE]: 'Invalid signature',
};

let toJstpArrayMethod = null;

// JSTP remote error class
// TODO: implement RPC stacktrace
class RemoteError extends Error {
  //  JSTP RemoteError constructor
  //    code - error code
  //    message - optional error message
  //
  constructor(code, message, info = null) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RemoteError);
    } else {
      this.stack = new Error(message).stack;
    }

    this.message = message || defaultMessages[code] || code.toString();

    this.code = code;
    if (this.toJstpArray !== toJstpArrayMethod) {
      this.toJstpArray = deprecate(
        this.toJstpArray,
        'toJstpArray() method is deprecated, implement toJSTP() instead'
      );
    }

    this.info = info;
  }

  get name() {
    return 'RemoteError';
  }

  // Convert a RemoteError instance to array representing
  // an error in JSTP messages
  // Deprecated: this method will be removed in the next major version, use
  // toJSTP() method instead.
  //
  toJstpArray() {
    return this.toJSTP();
  }

  // Convert a RemoteError instance to a value representing
  // an error in JSTP messages
  //
  toJSTP() {
    if (this.toJstpArray !== toJstpArrayMethod) return this.toJstpArray();
    const isMessagePresent = this.message !== this.code.toString();
    const isMessageStandard = defaultMessages.hasOwnProperty(this.code);

    if (isMessagePresent && !isMessageStandard) {
      if (!this.info) {
        return [this.code, this.message];
      }
      return [this.code, this.message, ...this.info];
    } else {
      return [this.code];
    }
  }

  // Factory method that creates a RemoteError instance from a JSTP array
  //   array - array in the form of [code, description]
  //
  static fromJstpArray(array) {
    return new RemoteError(
      array[0],
      array[1],
      array.length > 2 ? array.slice(2) : null
    );
  }

  // Prepare an error to be sent in a JSTP message
  //   error - an error to prepare (instance of Error, RemoteError, a string or
  //           a regular JavaScript array of error code and error description)
  //
  static getJstpArrayFor(error) {
    if (
      Object.prototype.toString.call(error) === '[object Error]' &&
      typeof error.toJSTP === 'function'
    ) {
      return this.getJstpArrayFor(error.toJSTP());
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

RemoteError.prototype.toJstpArray = deprecate(
  RemoteError.prototype.toJstpArray,
  'toJstpArray() method is deprecated, use toJSTP() instead'
);
toJstpArrayMethod = RemoteError.prototype.toJstpArray;

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
