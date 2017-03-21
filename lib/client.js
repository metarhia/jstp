'use strict';

const events = require('events');
const util = require('util');

const apps = require('./applications');
const common = require('./common');
const Connection = require('./connection');

module.exports = Client;

// JSTP client
//   rawClient - underlying network client
//   application - a JSTP application
//   heartbeatInterval - heartbeat interval, if heartbeat should be used
//
function Client(rawClient, application, heartbeatInterval) {
  events.EventEmitter.call(this);

  if (!application) {
    application = new apps.Application('jstp', {});
  }

  this.rawClient = rawClient;
  this.application = application;
  this.connection = null;
  this.heartbeatInterval = heartbeatInterval;

  common.forwardMultipleEvents(rawClient, this, [
    'connect',
    'error',
    'close'
  ]);
}

util.inherits(Client, events.EventEmitter);

// Connect to a server
//   callback - callback function
//
Client.prototype.connect = function(callback) {
  this.rawClient.connect((error) => {
    if (error) {
      return callback(error);
    }

    const transport = this.rawClient.createTransport();
    const connection = new Connection(transport, null, this);

    if (this.heartbeatInterval) {
      connection.startHeartbeat(this.heartbeatInterval);
    }

    this.connection = connection;
    callback(null, connection);
  });
};

// Disconnect from the server
//   callback - callback function
//
Client.prototype.disconnect = function(callback) {
  if (this.connection) {
    this.connection.close();
  }
  this.rawClient.disconnect(callback);
};

// Helper methods that calls 'connect' and then performs handshake
//   appName - name of the application to connect to
//     (see Connection#handshake(appName, username, password, callback))
//   username - user login (or null for anonymous session)
//   password - user password (or null for anonymous session)
//   callback - callback function with signature (error, connection, sessionId)
//
Client.prototype.connectAndHandshake = function(
  appName, username, password, callback
) {
  this.connect((error, connection) => {
    if (error) {
      return callback(error);
    }

    connection.handshake(appName, username, password, (error) => {
      if (error) {
        return callback(error);
      }

      callback(null, connection);
    });
  });
};

// Helper methods that calls 'connect', performs handshake and loads
// introspection of specified interfaces
//   appName - name of the application to connect to
//     (see Connection#handshake(appName, username, password, callback))
//   username - user login (or null for anonymous session)
//   password - user password (or null for anonymous session)
//   interfaces - array of names of interfaces to inspect
//   callback - callback function with signature
//     (error, connection, sessionId, api)
//
Client.prototype.connectAndInspect = function(
  appName, username, password, interfaces, callback
) {
  this.connectAndHandshake(
    appName, username, password, (error, connection) => {
      if (error) {
        return callback(error);
      }

      // DataCollector from metarhia/MetaSync is a better abstraction to do
      // this kind of things, but there are some issues that must be resolved
      // prior to using it here.
      Promise.all(
        interfaces.map((name) => new Promise((resolve, reject) => {
          connection.inspectInterface(name, (error, proxy) => {
            if (error) {
              reject(error);
            } else {
              resolve(proxy);
            }
          });
        }))
      ).then((proxies) => {
        const api = proxies.reduce((acc, proxy, idx) => {
          const name = interfaces[idx];
          acc[name] = proxy;
          return acc;
        }, Object.create(null));
        callback(null, connection, api);
      }).catch((error) => {
        callback(error);
      });
    }
  );
};
