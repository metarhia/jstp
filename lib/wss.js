'use strict';

const https = require('https');

const common = require('./common');
const jstpServer = require('./server');
const webSocket = require('./ws-internal');
const transportCommon = require('./transport-common');

// Secure WebSocket server for JSTP server.
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
  //   listener - jstp server connection listener that will be registered on
  //              server 'connect' event
  //
  // See node https.Server for option docs.
  //
  constructor(options, webSocketOptions, listener) {
    super(options);
    jstpServer.initServer.call(this, options.applications,
      options.authPolicy, options.heartbeatInterval, listener);
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

// Create a JSTP server bound to a secure WebSocket server.
// see jstp.wss.Server
// see transportCommon.newCreateServerFn
//
const createServer = transportCommon.newCreateServerFn(Server);

module.exports = {
  Transport: webSocket.Transport,
  Server,
  createServer: (options, webSocketOptions, listener) =>
    createServer(options, webSocketOptions, listener),
  connect: webSocket.connect,
  connectAndInspect: webSocket.connectAndInspect
};
