'use strict';

const crypto = require('crypto');
const events = require('events');

const errors = require('./errors');

// Simple generic authentication provider. You are free to implement
// whatever suits your needs instead.
//
const simpleAuth = new events.EventEmitter();
module.exports = simpleAuth;

// Start session. Only anonymous handshakes are allowed.
//   connection - JSTP connection
//   application - application instance
//   strategy - authentication strategy (only 'anonymous' is supported)
//   credentials - authentication credentials
//   callback - callback function that has signature
//              (error, username, sessionId)
//
simpleAuth.startSession = (
  connection, application,
  strategy, credentials, callback
) => {
  if (strategy !== 'anonymous') {
    return callback(errors.ERR_AUTH_FAILED);
  }

  const sessionId = generateUuid4();
  simpleAuth.emit('session', sessionId, connection, application);

  callback(null, null, sessionId);
};

// Generate UUID v4
//
function generateUuid4() {
  const bytes = crypto.randomBytes(128);

  bytes[6] &= 0x0F;
  bytes[6] |= 0x40;

  bytes[8] &= 0x3F;
  bytes[8] |= 0x80;

  return [
    bytes.toString('hex', 0, 4),
    bytes.toString('hex', 4, 6),
    bytes.toString('hex', 6, 8),
    bytes.toString('hex', 8, 10),
    bytes.toString('hex', 10, 16)
  ].join('-');
}
