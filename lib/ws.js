'use strict';

const http = require('http');

const common = require('./common');
const jstpServer = require('./server');
const webSocket = require('./web-socket');
const transportCommon = require('./transport-common');

// WebSocket server for JSTP server
//
class Server extends http.Server {
  // Constructs JSTP Server bound to WebSocket Server based on
  // node http.Server.
  //   options - an object that contains applications array or
  //             index and can optionally contain authPolicy and
  //             heartbeatInterval (see jstp.Server).
  //
  //   webSocketOptions - can contain originCheckStrategy or default
  //                      webSocket.allowAllOriginCheckStrategy will be used.
  //                      Passed directly to websocket.server.
  //     originCheckStrategy - a function that checks the origin of a WebSocket
  //     request and returns a boolean indicating whether to allow it (optional)
  //
  //   listener - request listener that will be passed directly to
  //              http.Server
  //
  // See node http.Server for option docs.
  //
  constructor(options, webSocketOptions = {}, listener) {
    super(listener);
    jstpServer.initServer.call(this, options.applications,
      options.authPolicy, options.heartbeatInterval);

    webSocket.initServer.call(this, webSocketOptions, this);
  }

  // Create a JSTP transport from a WebSocket connection
  //   connection - WebSocket connection
  //
  createTransport(connection) {
    return new webSocket.Transport(connection);
  }
}
common.mixin(Server, jstpServer.Server);

// Create a JSTP server bound to a WebSocket server
// see jstp.ws.Server
// see transportCommon.createServerFactory
//
const createServer =
  transportCommon.createServerFactory((...args) => new Server(...args));

module.exports = {
  Transport: webSocket.Transport,
  Server,
  createServer: (options, webSocketOptions, listener) =>
    createServer(options, webSocketOptions, listener),
  createConnection: webSocket.createConnection,
  createConnectionAndInspect: webSocket.createConnectionAndInspect
};
