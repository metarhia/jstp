'use strict';

var events = require('events');
var util = require('util');

var apps = require('./applications');
var common = require('./common');
var Connection = require('./connection');

module.exports = Client;

// JSTP client
//   rawClient - underlying network client
//   application - a JSTP application
//   heartbeatInterval - heartbeat interval, if heartbeat should be used
//                       (optional)
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
  this.rawClient.connect(function(error) {
    if (error) {
      return callback(error);
    }

    var transport = this.rawClient.createTransport();
    var connection = new Connection(transport, null, this);

    if (this.heartbeatInterval) {
      connection.startHeartbeat(this.heartbeatInterval);
    }

    this.connection = connection;
    callback(null, connection);
  }.bind(this));
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
Client.prototype.connectAndHandshake =
  function(appName, username, password, callback) {
    this.connect(function(error, connection) {
      if (error) {
        return callback(error);
      }

      connection.handshake(appName, username, password, function(error, sid) {
        if (error) {
          return callback(error);
        }

        callback(null, connection, sid);
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
Client.prototype.connectAndInspect =
  function(appName, username, password, interfaces, callback) {
    this.connectAndHandshake(appName, username, password,
      handshakeCallback.bind(this, interfaces, callback));
  };

// Internal function, part of Client#connectAndInspect method
//
function handshakeCallback(interfaces, callback, error, connection, sid) {
  if (error) {
    return callback(error);
  }

  var api = {};
  var done = false;
  var count = 0;

  interfaces.forEach(function(interfaceName) {
    connection.inspectInterface(interfaceName, function(error, appInterface) {
      if (done) return;
      if (error) {
        done = true;
        return callback(error);
      }
      api[interfaceName] = appInterface;
      count++;
      if (count === interfaces.length) {
        done = true;
        callback(null, connection, sid, api);
      }
    });
  });
}
