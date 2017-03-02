'use strict';

const events = require('events');
const fs = require('fs');
const net = require('net');
const stream = require('stream');
const tls = require('tls');
const util = require('util');

const common = require('./common');
const jsrs = require('./record-serialization');
const transportCommon = require('./transport.common');
const Client = require('./client');
const Server = require('./server');

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
  if (this.port) {
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
  stream.Duplex.call(this, {
    readableObjectMode: true,
    writableObjectMode: true,
    allowHalfOpen: false
  });

  this.remoteAddress = socket.remoteAddress;

  this._socket = socket;
  this._buffer = '';
  this._readable = false;

  socket.setEncoding('utf8');
  socket.on('error', (err) => this.emit('error', err));
  socket.on('end', () => this.push(null));
  socket.on('readable', () => {
    this._readable = true;
    this._read();
  });
}

util.inherits(SocketTransport, stream.Duplex);
sock.SocketTransport = SocketTransport;

SocketTransport.prototype._read = function() {
  if (!this._readable) return;

  const chunk = this._socket.read();
  if (chunk === null) return;
  this._buffer += chunk;

  this._readable = false;

  const packets = [];
  try {
    this._buffer = jsrs.parseNetworkPackets(this._buffer, packets);
  } catch (error) {
    this._socket.destroy(error);
  }

  const packetsCount = packets.length;
  for (let i = 0; i < packetsCount; i++) {
    const packet = packets[i];
    if (packet !== null) this.push(packet);
  }

  if (this._buffer.length > MAX_PACKET_SIZE) {
    this._socket.destroy(new Error('Maximal packet size exceeded'));
  }
};

SocketTransport.prototype._write = function(packet, encoding, callback) {
  this._socket.cork();
  writeOne(this._socket, packet);
  process.nextTick(uncork, this._socket, callback);
};

SocketTransport.prototype._writev = function(packets, callback) {
  this._socket.cork();
  const count = packets.length;
  for (let i = 0; i < count; i++) {
    writeOne(this._socket, packets[i].chunk);
  }
  process.nextTick(uncork, this._socket, callback);
};

function writeOne(socket, packet) {
  socket.write(jsrs.stringify(packet));
  socket.write(SEPARATOR);
}

function uncork(socket, callback) {
  socket.uncork();
  callback();
}
