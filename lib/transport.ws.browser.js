/* eslint-env browser, commonjs */
'use strict';

const events = require('events');
const util = require('util');

const jsrs = require('./record-serialization');
const Client = require('./client');
const common = require('./common');
const constants = require('./internal-constants');
const transportCommon = require('./transport.common');

const ws = {};
module.exports = ws;

// Create a JSTP client that will transfer data over a WebSocket connection
//   url - WebSocket endpoint URL
//   appProvider - client application provider
//
ws.createClient = (url, appProvider) => {
  const wsClient = new W3CWebSocketClient(url);
  const jstpClient = new Client(wsClient, appProvider);
  return jstpClient;
};

// Client WebSocket connection for JSTP
//   url - WebSocket endpoint URL
//
function W3CWebSocketClient(url) {
  events.EventEmitter.call(this);

  this.url = url;
  this.socket = null;
  this.socketEventEmitter = null;
  this.isConnected = false;
}

util.inherits(W3CWebSocketClient, events.EventEmitter);
ws.W3CWebSocketClient = W3CWebSocketClient;

// Connect to the server
//  callback - callback function
//
W3CWebSocketClient.prototype.connect = function(callback) {
  if (this.isConnected) {
    if (callback) {
      callback(new Error('Already connected'));
    }
    return;
  }

  try {
    this.socket = new WebSocket(this.url, constants.WEBSOCKET_PROTOCOL_NAME);
  } catch (error) {
    if (callback) {
      callback(error);
    }
    return;
  }

  this.socketEventEmitter = new events.EventEmitter();

  this.socket.onopen = this._onOpen.bind(this);
  this.socket.onclose = this._onClose.bind(this);
  this.socket.onerror = this._onError.bind(this);
  this.socket.onmessage = this._onMessage.bind(this);

  this.socketEventEmitter.once('connectFailed', (error) => {
    if (callback) {
      callback(error);
    }
  });

  this.socketEventEmitter.once('open', () => {
    if (callback) {
      callback();
    }
  });
};

// Disconnect from the server
//
W3CWebSocketClient.prototype.disconnect = function(callback) {
  transportCommon.ensureClientConnected(this);
  if (callback) {
    this.socketEventEmitter.once('close', callback);
  }
  this.socket.close();
};

// Create a JSTP transport from the underlying WebSocket connection
//
W3CWebSocketClient.prototype.createTransport = function() {
  transportCommon.ensureClientConnected(this);
  return new W3CWebSocketTransport(this.socket, this.socketEventEmitter);
};

// W3C WebSocket open event handler
//
W3CWebSocketClient.prototype._onOpen = function() {
  this.isConnected = true;
  this.socketEventEmitter.emit('open');
};

// W3C WebSocket close event handler
//
W3CWebSocketClient.prototype._onClose = function() {
  this.isConnected = false;
  this.socketEventEmitter.emit('close');
};

// W3C WebSocket error event handler
//
W3CWebSocketClient.prototype._onError = function(error) {
  if (this.isConnected) {
    this.socketEventEmitter.emit('error', error);
  } else {
    this.socketEventEmitter.emit('connectFailed', error);
  }
};

// W3C WebSocket error event handler
//
W3CWebSocketClient.prototype._onMessage = function(message) {
  this.socketEventEmitter.emit('message', message);
};

// W3C WebSocket transport for JSTP
//   socket - WebSocket instance
//   socketEventEmitter - an EventEmitter that proxies socket events
//
function W3CWebSocketTransport(socket, socketEventEmitter) {
  events.EventEmitter.call(this);

  this.socket = socket;
  this.socketEventEmitter = socketEventEmitter;

  this.remoteAddress = socket.url;

  common.forwardMultipleEvents(socketEventEmitter, this, [
    'close',
    'error'
  ]);

  this.socketEventEmitter.on('message', this._onMessage.bind(this));
}

util.inherits(W3CWebSocketTransport, events.EventEmitter);
ws.W3CWebSocketTransport = W3CWebSocketTransport;

// Send data over the connection
//   data - Buffer or string
//
W3CWebSocketTransport.prototype.send = function(data) {
  if (Buffer.isBuffer(data)) {
    data = data.toString();
  }

  this.socket.send(data);
};

// End the connection optionally sending the last chunk of data
//   data - Buffer or string (optional)
//
W3CWebSocketTransport.prototype.end = function(data) {
  if (data) {
    this.send(data);
  }

  this.socket.close();
};

// WebSocket message handler
//   message - WebSocket message
//
W3CWebSocketTransport.prototype._onMessage = function(message) {
  const data = (
    typeof(message.data) === 'string' ?
    message.data :
    new Buffer(message.data).toString()
  );

  let packet;
  try {
    packet = jsrs.parse(data);
  } catch (error) {
    this.emit('error', error);
    return;
  }

  this.emit('packet', packet);
};
