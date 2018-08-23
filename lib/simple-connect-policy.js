'use strict';

// Simple generic connection provider. Used for user-side connection.
// You are free to implement whatever suits your needs instead.
// Sends handshake with login/password if provided otherwise sends
// anonymous handshake.
//
module.exports = class SimpleConnectPolicy {
  //   login - user name (optional)
  //   password - user password (optional, but must be provided if login
  //              is provided)
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
  //   session - Session object to reconnect to existing session (optional)
  //   callback - callback function that has signature
  //              (error, connection)
  //
  connect(app, connection, session, callback) {
    if (!session) {
      connection.handshake(
        app, this.login, this.password,
        (error, session) => {
          callback(error, connection, session);
        }
      );
    } else {
      connection.handshake(
        app, session, null,
        error => {
          callback(error, connection);
        }
      );
    }
  }
};
