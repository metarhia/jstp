'use strict';

// Simple generic connection provider. Used for user-side connection.
// You are free to implement whatever suits your needs instead.
// Sends handshake with login/password if provided otherwise sends
// anonymous handshake.
//
module.exports = class SimpleConnectPolicy {
  constructor(login, password) {
    this.login = login;
    this.password = password;
  }

  // Should send handshake message with appropriate credentials
  // You can get client object provided upon connection creation
  // with connection.client.
  //   app - string or object, application to connect to as 'name' or
  //         'name@version' or { name, version }, where version
  //         must be a valid semver range
  //   connection - JSTP connection
  //   callback - callback function that has signature
  //              (error, connection)
  //
  connect(app, connection, callback) {
    connection.handshake(
      app, this.login, this.password,
      (error) => {
        callback(error, connection);
      });
  }
};
