/* eslint-env browser, commonjs */
'use strict';

const EventEmitter = require('events').EventEmitter;

const jsrs = require('./record-serialization');
const common = require('./common');
const constants = require('./internal-constants');
const transportCommon = require('./transport-common');

// W3C WebSocket transport for JSTP.
//   socket - WebSocket instance
//   socketEventEmitter - an EventEmitter that proxies socket events
//
class Transport extends EventEmitter {
  constructor(socket) {
    super();

    this.socket = socket;

    this.socket.onmessage = message => this._onMessage(message);

    common.forwardMultipleEvents(this.socket, this, ['close', 'error']);
  }

  // returns underlying socket.
  //
  getRawTransport() {
    return this.socket;
  }

  // Send data over the connection.
  //   data - Buffer or string
  //
  send(data) {
    if (Buffer.isBuffer(data)) {
      data = data.toString();
    }

    this.socket.send(data);
  }

  // End the connection optionally sending the last chunk of data.
  //   data - Buffer or string (optional)
  //
  end(data) {
    if (data) {
      this.send(data);
    }

    this.socket.close();
  }

  // WebSocket message handler.
  //   message - WebSocket message
  //
  _onMessage(message) {
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
  }
}

// Create a JSTP client that will transfer data over a WebSocket connection.
//   url - WebSocket endpoint URL
//   appProvider - client application provider
//
const socketFactory = (url, callback) => {
  try {
    const webSocket = new WebSocket(url, constants.WEBSOCKET_PROTOCOL_NAME);
    webSocket.onopen = () => callback(null, webSocket);
    webSocket.onerror = callback;
  } catch (error) {
    if (callback) callback(error);
  }
};

// see transportCommon.newConnectFn
//
const connect =
  transportCommon.newConnectFn(
    socketFactory,
    Transport
  );

// see transportCommon.newConnectAndInspectFn
//
const connectAndInspect =
  transportCommon.newConnectAndInspectFn(
    socketFactory,
    Transport
  );

module.exports = {
  Transport,
  connect: (appName, client, url, callback) =>
    connect(appName, client, url, callback),
  connectAndInspect: (appName, client, interfaces, url, callback) =>
    connectAndInspect(appName, client, interfaces, url, callback)
};
