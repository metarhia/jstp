'use strict';

const EventEmitter = require('events').EventEmitter;
const uuid4 = require('uuid/v4');

const errors = require('./errors');

// Simple generic authentication provider. You are free to implement
// whatever suits your needs instead.
//
module.exports = class SimpleAuthPolicy extends EventEmitter {
  constructor() {
    super();
  }

  // Start session. Only anonymous handshakes are allowed.
  //   connection - JSTP connection
  //   application - application instance
  //   strategy - authentication strategy (only 'anonymous' is supported)
  //   credentials - authentication credentials
  //   callback - callback function that has signature
  //              (error, username, sessionId)
  //
  startSession(connection, application, strategy, credentials, callback) {
    if (strategy !== 'anonymous') {
      return callback(errors.ERR_AUTH_FAILED);
    }

    const sessionId = uuid4();
    this.emit('session', sessionId, connection, application);

    callback(null, null, sessionId);
  }
};
