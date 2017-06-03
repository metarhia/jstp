'use strict';

const https = require('https');

const common = require('./common');
const jstpServer = require('./server');
const webSocket = require('./web-socket');
const transportCommon = require('./transport-common');

// Secure WebSocket server for JSTP server
//
class Server extends https.Server {
  // Constructs JSTP Server bound to WebSocket Server based on
  // node https.Server.
  //   options - an object that contains applications array or
  //             index and can optionally contain authPolicy and
  //             heartbeatInterval (see jstp.Server).
  //             Also it will be passed directly to node https.Server.
  //
  //   webSocketOptions - can contain originCheckStrategy or default
  //                      webSocket.allowAllOriginCheckStrategy will be used.
  //                      Passed directly to websocket.server.
  //     originCheckStrategy - a function that checks the origin of a WebSocket
  //     request and returns a boolean indicating whether to allow it (optional)
  //
  //   listener - request listener that will be passed directly to
  //              https.Server
  //
  // See node https.Server for option docs.
  //
  constructor(options, webSocketOptions, listener) {
    super(options, listener);
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

// Create a JSTP server bound to a secure WebSocket server
// see jstp.wss.Server
// see transportCommon.createServerFactory
//
const createServer =
  transportCommon.createServerFactory((...args) => new Server(...args));

module.exports = {
  Server,
  createServer: (options, webSocketOptions, listener) =>
    createServer(options, webSocketOptions, listener),
  createConnection: webSocket.createConnection,
  createConnectionAndInspect: webSocket.createConnectionAndInspect
};
