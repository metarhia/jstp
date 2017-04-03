'use strict';

var net = require('net');
var tls = require('tls');
var util = require('util');
var events = require('events');

var jsrs = require('./record-serialization');
var common = require('./common');
var Server = require('./server');
var Client = require('./client');
var transportCommon = require('./transport.common');

var SEPARATOR = common.createZeroFilledBuffer(1);
var MAX_PACKET_SIZE = 8 * 1024 * 1024;

var tcp = {};
module.exports = tcp;

// Create a JSTP server bound to a TCP server
//   config - TCP server config
//   applications - applications index
//   authCallback - authentication callback
//
tcp.createServer = function(config, applications, authCallback) {
  var secure = false;

  if (typeof(config) === 'number') {
    config = { port: config };
  } else if (config.key && config.cert) {
    secure = true;
  }

  var tcpServer = (secure ? tls : net).createServer(config);

  var transportServer = new TcpServer(tcpServer, config.port, secure);
  var jstpServer = new Server(transportServer, applications, authCallback,
    config.heartbeat);

  return jstpServer;
};

// Create a JSTP client that will transfer data over a TCP connection
//   config - TCP client config
//   application - client application
//
tcp.createClient = function(config, application) {
  var tcpClient = new TcpClient(config);
  var jstpClient = new Client(tcpClient, application, config.heartbeat);

  return jstpClient;
};

// TCP server for JSTP server
//   server - TCP server instance
//   port - port to listen on
//   secure - indicates whether SSL/TLS is used
//
function TcpServer(server, port, secure) {
  events.EventEmitter.call(this);

  this.server = server;
  this.port = port;

  common.forwardMultipleEvents(server, this, [
    'listening',
    'close',
    'error'
  ]);

  var connectEventName = secure ? 'secureConnection' : 'connection';
  common.forwardEvent(server, this, connectEventName, 'connection');
}

util.inherits(TcpServer, events.EventEmitter);
tcp.TcpServer = TcpServer;

// Switch the server into listening state
//   callback - callback function (optional)
//
TcpServer.prototype.listen = function(callback) {
  this.server.listen(this.port, callback);
};

// Stop listening for connections
//   callback - callback function (optional)
//
TcpServer.prototype.close = function() {
  this.server.close();
};

// Create a JSTP transport from a TCP socket
//   socket - TCP socket instance
//
TcpServer.prototype.createTransport = function(socket) {
  return new TcpTransport(socket);
};

// TCP client connection
//   config - TCP connection config
//
function TcpClient(config) {
  events.EventEmitter.call(this);

  this.config = config;
  this.socket = null;
  this.isConnected = false;
}

util.inherits(TcpClient, events.EventEmitter);
tcp.TcpClient = TcpClient;

// Connect to the server
//  callback - callback function
//
TcpClient.prototype.connect = function(callback) {
  if (this.isConnected) {
    return callback(new Error('Already connected'));
  }

  var tcpModule = this.config.secure ? tls : net;

  this.socket = tcpModule.connect(this.config, function() {
    this.isConnected = true;
    callback();
    this.emit('connect');
  }.bind(this));

  this.socket.on('error', function(error) {
    if (this.isConnected) {
      this.emit('error', error);
    } else {
      callback(error);
    }
  }.bind(this));

  this.socket.on('close', this._onSocketClose.bind(this));
};

// Disconnect from the server
//
TcpClient.prototype.disconnect = function(callback) {
  transportCommon.ensureClientConnected(this);

  if (callback) {
    this.socket.once('close', callback);
  }

  this.socket.end();
};

// Create a JSTP transport from the underlying TCP socket
//
TcpClient.prototype.createTransport = function() {
  transportCommon.ensureClientConnected(this);
  return new TcpTransport(this.socket);
};

// Socket close handler
//
TcpClient.prototype._onSocketClose = function() {
  this.isConnected = false;
  this.emit('close');
};

// JSTP transport for TCP
//   socket - TCP socket instance
//
function TcpTransport(socket) {
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

util.inherits(TcpTransport, events.EventEmitter);
tcp.TcpTransport = TcpTransport;

// Send data over the connection
//   data - Buffer or string
//
TcpTransport.prototype.send = function(data) {
  this.socket.cork();
  this.socket.write(data);
  this.socket.write(SEPARATOR);
  process.nextTick(this._uncorkSocket);
};

// End the connection optionally sending the last chunk of data
//   data - Buffer or string (optional)
//
TcpTransport.prototype.end = function(data) {
  if (data) {
    this.socket.cork();
    this.socket.write(data);
    this.socket.end(SEPARATOR);
  } else {
    this.socket.end();
  }

  this.socket.destroy();
};

// TCP socket data handler
//   data - data received
//
TcpTransport.prototype._onSocketData = function(chunk) {
  var packets = [];
  this._buffer += chunk;

  try {
    this._buffer = jsrs.parseNetworkPackets(this._buffer, packets);
  } catch (error) {
    this.emit('error', error);
    return;
  }

  var packetsCount = packets.length;
  for (var i = 0; i < packetsCount; i++) {
    this.emit('packet', packets[i]);
  }

  if (this._buffer.length > MAX_PACKET_SIZE) {
    this.emit('error', new Error('Maximal packet size exceeded'));
  }
};
