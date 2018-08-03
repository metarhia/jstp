'use strict';

const http = require('http');

const common = require('./common');
const jstpServer = require('./server');
const webSocket = require('./ws-internal');
const transportCommon = require('./transport-common');

// WebSocket server for JSTP server
//
class Server extends http.Server {
  // Constructs JSTP Server bound to WebSocket Server based on
  // node http.Server.
  //   options - an object that contains applications array or
  //             index and can optionally contain authPolicy,
  //             sessionStorageProvider, heartbeatInterval and
  //             clientExpirationTime (see jstp.Server).
  //
  //   webSocketOptions - can contain originCheckStrategy or default
  //                      webSocket.allowAllOriginCheckStrategy will be used.
  //                      Passed directly to websocket.server.
  //     originCheckStrategy - a function that checks the origin of a WebSocket
  //     request and returns a boolean indicating whether to allow it (optional)
  //
  //   listener - jstp server connection listener that will be registered on
  //              server 'connect' event
  //
  // See node http.Server for option docs.
  //
  constructor(options, webSocketOptions = {}, listener) {
    super();
    jstpServer.initServer.call(
      this,
      options.applications,
      options.authPolicy,
      options.sessionStorageProvider,
      options.heartbeatInterval,
      options.clientExpirationTime,
      listener
    );
    webSocket.initServer(webSocketOptions, this);
  }

  // Create a JSTP transport from a WebSocket connection.
  //   connection - WebSocket connection
  //
  createTransport(connection) {
    return new webSocket.Transport(connection);
  }
}
common.mixin(Server.prototype, jstpServer.Server.prototype);

// Create a JSTP server bound to a WebSocket server.
// see jstp.ws.Server
// see transportCommon.newCreateServerFn
//
const createServer = transportCommon.newCreateServerFn(Server);

module.exports = {
  Transport: webSocket.Transport,
  Server,
  createServer: (options, webSocketOptions, listener) =>
    createServer(options, webSocketOptions, listener),
  // see ws-internal.newConnectFn
  connect: webSocket.connect,
  // see ws-internal.newConnectAndInspectFn
  connectAndInspect: webSocket.connectAndInspect,
  // see ws-internal.newReconnectFn
  reconnect: webSocket.reconnect,
};
