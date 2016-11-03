'use strict';

var crypto = require('crypto');
var events = require('events');

var errors = require('./errors');

// Simple generic authentication provider. You are free to implement
// whatever suits your needs instead.
//
var simpleAuthProvider = new events.EventEmitter();
module.exports = simpleAuthProvider;

// Server applications provider instance
//
var appsProvider = null;

// Start anonymous session
//   connection - JSTP connection
//   application - application instance
//   callback - callback function that has signature (error, sessionId)
//
simpleAuthProvider.startAnonymousSession =
  function(connection, application, callback) {
    if (appsProvider && !appsProvider.getApplication(application)) {
      callback(new errors.RemoteError(errors.ERR_APP_NOT_FOUND));
    }

    var sessionId = generateUuid4();
    this.emit('session', sessionId, connection, application);

    callback(null, sessionId);
  };

// Start authenticated session
//   connection - JSTP connection
//   application - application instance
//   username - user login
//   password - user password
//   callback - callback function that has signature (error, sessionId)
//
simpleAuthProvider.startAuthenticatedSession =
  // eslint-disable-next-line no-unused-vars
  function(connection, application, username, password, callback) {
    throw new Error('You must implement your own authentication provider ' +
      'to be able to use password authentication in JSTP');
  };

// Connect a server applications provider
//   provider  - server applications provider instance
//
simpleAuthProvider.connectAppsProvider = function(provider) {
  appsProvider = provider;
};

// Generate UUID v4
//
function generateUuid4() {
  var bytes = crypto.randomBytes(128);

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