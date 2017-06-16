'use strict';

const tls = require('tls');

const sock = require('./socket');
const transportCommon = require('./transport-common');
const jstpServer = require('./server');
const common = require('./common');

class Server extends tls.Server {
  // Constructs JSTP Server bound to node tls.Server.
  //   options - an object that contains applications array or
  //             index and can optionally contain authPolicy and
  //             heartbeatInterval (see jstp.Server).
  //             Also it will be passed directly to node tls.Server.
  //   listener - jstp server connection listener that will be registered on
  //              server 'connect' event
  //
  // See node tls.Server for option docs.
  //
  constructor(options, listener) {
    super(options);
    jstpServer.initServer.call(this, options.applications,
      options.authPolicy, options.heartbeatInterval, listener);
    this.on('secureConnection', socket => this._onRawConnection(socket));
  }

  // Create a JSTP transport from a socket.
  //   socket - socket instance
  //
  createTransport(socket) {
    return new sock.Transport(socket);
  }
}
common.mixin(Server.prototype, jstpServer.Server.prototype);

// Create tls JSTP server.
// see jstp.tls.Server
// see transportCommon.createServerFactory
//
const createServer = transportCommon.createServerFactory(Server);

const createConnection = sock.createConnectionFactory(tls.connect);

const createConnectionAndInspect =
  sock.createConnectionAndInspectFactory(tls.connect);

module.exports = {
  Transport: sock.Transport,
  Server,
  createServer: (options, listener) =>
    createServer(options, listener),
  // see transportCommon.createConnectionFactory
  createConnection: (appName, client, ...options) =>
    createConnection(appName, client, ...options),
  // see transportCommon.createConnectionAndInspectFactory
  createConnectionAndInspect: (appName, client, interfaces, ...options) =>
    createConnectionAndInspect(appName, client, interfaces, ...options)
};
