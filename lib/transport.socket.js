'use strict';

const fs = require('fs');
const net = require('net');
const tls = require('tls');
const util = require('util');
const events = require('events');

const jsrs = require('./record-serialization');
const common = require('./common');
const Server = require('./server');
const Client = require('./client');
const transportCommon = require('./transport.common');

const SEPARATOR = Buffer.alloc(1);
const MAX_PACKET_SIZE = 8 * 1024 * 1024;

const sock = {};
module.exports = sock;

// Create a JSTP server bound to a POSIX socket
//   config - socket server config
//   applications - applications index
//   authCallback - authentication callback
//
sock.createServer = (config, applications, authCallback) => {
  const secure = config.key && config.cert;
  const rawServer = (secure ? tls : net).createServer(config);
  const transportServer = new SocketServer(rawServer, config);
  const jstpServer = new Server(transportServer, applications,
    authCallback, config.heartbeat);
  return jstpServer;
};

// Create a JSTP client that will transfer data over a socket
//   config - network client config
//   application - client application
//
sock.createClient = (config, application) => {
  const rawClient = new SocketClient(config);
  const jstpClient = new Client(rawClient, application, config.heartbeat);
  return jstpClient;
};

// Socket connection server
//   server - network server instance
//   config - server config
//
function SocketServer(server, config) {
  events.EventEmitter.call(this);

  this.server = server;
  this.port = config.port;
  this.path = config.path;

  common.forwardMultipleEvents(server, this, [
    'listening',
    'close',
    'error'
  ]);

  const connectEventName = config.secure ? 'secureConnection' : 'connection';
  common.forwardEvent(server, this, connectEventName, 'connection');
}

util.inherits(SocketServer, events.EventEmitter);
sock.SocketServer = SocketServer;

// Switch the server into listening state
//   callback - callback function (optional)
//
SocketServer.prototype.listen = function(callback) {
  if (this.port !== undefined) {
    this.server.listen(this.port, callback);
  } else {
    fs.unlink(this.path, () => {
      this.server.listen(this.path, callback);
      this.server.once('close', () => {
        fs.unlink(this.path, () => { });
      });
    });
  }
};

// Stop listening for connections
//   callback - callback function (optional)
//
SocketServer.prototype.close = function() {
  this.server.close();
};

// Create a JSTP transport from a socket
//   socket - socket instance
//
SocketServer.prototype.createTransport = function(socket) {
  return new SocketTransport(socket);
};

// Returns address this server is bound to
SocketServer.prototype.address = function() {
  return this.server.address();
};

// Socket connection client
//   config - socket config
//
function SocketClient(config) {
  events.EventEmitter.call(this);

  this.config = config;
  this.socket = null;
  this.isConnected = false;
}

util.inherits(SocketClient, events.EventEmitter);
sock.SocketClient = SocketClient;

// Connect to the server
//  callback - callback function
//
SocketClient.prototype.connect = function(callback) {
  if (this.isConnected) {
    return callback(new Error('Already connected'));
  }

  const netModule = this.config.secure ? tls : net;

  this.socket = netModule.connect(this.config, () => {
    this.isConnected = true;
    callback();
    this.emit('connect');
  });

  this.socket.on('error', (error) => {
    if (this.isConnected) {
      this.emit('error', error);
    } else {
      callback(error);
    }
  });

  this.socket.on('close', this._onSocketClose.bind(this));
};

// Disconnect from the server
//
SocketClient.prototype.disconnect = function(callback) {
  transportCommon.ensureClientConnected(this);

  if (callback) {
    this.socket.once('close', callback);
  }

  this.socket.end();
};

// Create a JSTP transport from the underlying socket
//
SocketClient.prototype.createTransport = function() {
  transportCommon.ensureClientConnected(this);
  return new SocketTransport(this.socket);
};

// Socket close handler
//
SocketClient.prototype._onSocketClose = function() {
  this.isConnected = false;
  this.emit('close');
};

// JSTP transport for POSIX socket
//   socket - socket instance
//
function SocketTransport(socket) {
  events.EventEmitter.call(this);

  this.socket = socket;
  this._buffer = '';
  this._uncorkSocket = this.socket.uncork.bind(this.socket);

  this.remoteAddress = socket.remoteAddress;

  this.socket.setEncoding('utf8');
  this.socket.on('data', this._onSocketData.bind(this));

  common.forwardMultipleEvents(this.socket, this, [
    'error',
    'close'
  ]);
}

util.inherits(SocketTransport, events.EventEmitter);
sock.SocketTransport = SocketTransport;

// Send data over the connection
//   data - Buffer or string
//
SocketTransport.prototype.send = function(data) {
  this.socket.cork();
  this.socket.write(data);
  this.socket.write(SEPARATOR);
  process.nextTick(this._uncorkSocket);
};

// End the connection optionally sending the last chunk of data
//   data - Buffer or string (optional)
//
SocketTransport.prototype.end = function(data) {
  if (data) {
    this.socket.cork();
    this.socket.write(data);
    this.socket.end(SEPARATOR);
  } else {
    this.socket.end();
  }
};

// Socket data handler
//   data - data received
//
SocketTransport.prototype._onSocketData = function(chunk) {
  const packets = [];
  this._buffer += chunk;

  try {
    this._buffer = jsrs.parseNetworkPackets(this._buffer, packets);
  } catch (error) {
    this.socket.destroy(error);
    return;
  }

  const packetsCount = packets.length;
  for (let i = 0; i < packetsCount; i++) {
    this.emit('packet', packets[i]);
  }

  if (this._buffer.length > MAX_PACKET_SIZE) {
    this.emit('error', new Error('Maximal packet size exceeded'));
  }
};
