'use strict';

const net = require('net');

const sock = require('./socket');
const transportCommon = require('./transport-common');
const jstpServer = require('./server');
const common = require('./common');

class Server extends net.Server {
  // Constructs JSTP Server bound to node net.Server.
  //   options - an object that contains applications array or
  //             index and can optionally contain authPolicy,
  //             sessionStorageProvider and
  //             heartbeatInterval (see jstp.Server).
  //             Also it will be passed directly to node net.Server.
  //   listener - jstp server connection listener that will be registered on
  //              server 'connect' event
  //
  // See node net.Server for options docs.
  //
  constructor(options, listener) {
    super(options);
    jstpServer.initServer.call(
      this,
      options.applications,
      options.authPolicy,
      options.sessionStorageProvider,
      options.heartbeatInterval,
      listener
    );
    this.on('connection', (socket) => {
      this._onRawConnection(socket);
    });
  }

  // Create a JSTP transport from a socket.
  //   socket - socket instance
  //
  createTransport(socket) {
    return new sock.Transport(socket);
  }
}
common.mixin(Server.prototype, jstpServer.Server.prototype);

// Create net JSTP server.
// see jstp.net.Server
// see transportCommon.newCreateServerFn
//
const createServer = transportCommon.newCreateServerFn(Server);

// see transportCommon.newConnectFn
//
const connect = sock.newConnectFn(net.connect);

// see transportCommon.newConnectAndInspectFn
//
const connectAndInspect = sock.newConnectAndInspectFn(net.connect);

module.exports = {
  Transport: sock.Transport,
  Server,
  createServer: (options, listener) =>
    createServer(options, listener),
  connect: (app, client, ...options) =>
    connect(app, client, ...options),
  connectAndInspect: (app, client, interfaces, ...options) =>
    connectAndInspect(app, client, interfaces, ...options),
};
