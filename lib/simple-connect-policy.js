'use strict';

const EventEmitter = require('events').EventEmitter;

// Simple generic connection provider. Used for user-side connection.
// You are free to implement whatever suits your needs instead.
//
module.exports = class SimpleConnectPolicy extends EventEmitter {
  constructor() {
    super();
  }

  // Should send handshake packet with appropriate credentials
  // You can get client object provided upon connection creation
  // with connection.client.
  //   connection - JSTP connection
  //   callback - callback function that has signature
  //              (error, connection)
  //
  connect(appName, connection, callback) {
    connection.handshake(appName, null, null, (error) => {
      callback(error, connection);
    });
  }
};
