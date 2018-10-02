/* eslint-env browser, commonjs */
'use strict';

const EventEmitter = require('events').EventEmitter;

const mdsf = require('mdsf');

const { utf8split } = require('./common');
const constants = require('./internal-constants');
const transportCommon = require('./transport-common');

const SEND_INTERVAL = 50;
const BUFFER_SIZE_LIMIT = 64000;

// W3C WebSocket transport for JSTP.
//   socket - WebSocket instance
//   socketEventEmitter - an EventEmitter that proxies socket events
//
class Transport extends EventEmitter {
  constructor(socket) {
    super();

    this.socket = socket;
    this._receiveBuffer = '';
    this._sendBuffer = [];
    this._closed = false;

    this.socket.onmessage = message => {
      this._onMessage(message);
    };

    ['close', 'error'].forEach(event => {
      this.socket.addEventListener(event, (...args) => {
        this.emit(event, ...args);
      });
    });

    this._sendInterval = setInterval(() => {
      this._sendBufferedMessages();
    }, SEND_INTERVAL);

    this.once('close', () => {
      clearInterval(this._sendInterval);
    });
  }

  // returns underlying socket.
  //
  getRawTransport() {
    return this.socket;
  }

  _sendBufferedMessages() {
    let bufferedAmount = this.socket.bufferedAmount;
    let toSend = '';
    while (this._sendBuffer.length !== 0) {
      const message = this._sendBuffer[0];
      const maxChunkLength = BUFFER_SIZE_LIMIT - bufferedAmount;
      if (maxChunkLength < 0) {
        this.socket.close();
        throw new Error('WebSocket buffer is overflown');
      }
      if (maxChunkLength === 0) {
        break;
      }
      const [
        partToSend,
        remainingPart,
        toSendLength,
      ] = utf8split(message, maxChunkLength);
      toSend += partToSend;
      bufferedAmount += toSendLength;
      if (remainingPart !== '') {
        this._sendBuffer[0] = remainingPart;
        break;
      }
      this._sendBuffer.shift();
    }
    if (toSend !== '') {
      this.socket.send(toSend);
    }
    if (this._closed && this._sendBuffer.length === 0) {
      this.socket.close();
    }
  }

  // Send data over the connection.
  //   data - Buffer or string
  //
  send(data) {
    if (this._closed) {
      throw new Error('WebSocket: send after end');
    }

    if (Buffer.isBuffer(data)) {
      data = data.toString();
    }

    this._sendBuffer.push(data + constants.SEPARATOR);
  }

  // End the connection optionally sending the last chunk of data.
  //   data - Buffer or string (optional)
  //
  end(data) {
    if (data) {
      this.send(data);
    }

    this._closed = true;
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

    const messages = [];
    this._receiveBuffer += data;

    try {
      this._receiveBuffer =
        mdsf.parseJSTPMessages(this._receiveBuffer, messages);
    } catch (error) {
      this.emit('error', error);
      return;
    }

    for (let i = 0; i < messages.length; i++) {
      this.emit('message', messages[i]);
    }

    if (this._receiveBuffer.length > constants.MAX_MESSAGE_SIZE) {
      this.emit('error', new Error('Maximal message size exceeded'));
    }
  }
}

// Create a JSTP client that will transfer data over a WebSocket connection.
//   url - WebSocket endpoint URL
//   appProvider - client application provider
//
const socketFactory = (url, callback) => {
  try {
    const webSocket = new WebSocket(url, constants.WEBSOCKET_PROTOCOL_NAME);
    webSocket.onopen = () => {
      callback(null, webSocket);
    };
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
    Transport,
    'ws'
  );

// see transportCommon.newConnectAndInspectFn
//
const connectAndInspect =
  transportCommon.newConnectAndInspectFn(
    socketFactory,
    Transport,
    'ws'
  );

// see transportCommon.newReconnectFn
//
const reconnect =
  transportCommon.newReconnectFn(
    socketFactory,
    Transport
  );

module.exports = {
  Transport,
  connect: (app, client, url, callback) => connect(app, client, url, callback),
  connectAndInspect:
    (app, client, interfaces, url, callback) => connectAndInspect(
      app, client, interfaces, url, callback
    ),
  reconnect:
    (connection, url, callback) => reconnect(connection, url, callback),
};
