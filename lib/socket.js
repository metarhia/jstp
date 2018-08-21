'use strict';

const { EventEmitter } = require('events');

const transportCommon = require('./transport-common');
const serde = require('./serde');
const common = require('./common');

const SEPARATOR = Buffer.alloc(1);
const MAX_MESSAGE_SIZE = 8 * 1024 * 1024;

// JSTP transport for POSIX socket
//
class Transport extends EventEmitter {
  // Constructs transport instance.
  //   socket - socket instance
  //
  constructor(socket) {
    super();

    this.socket = socket;
    this._buffer = null;
    this._uncorkSocket = this.socket.uncork.bind(this.socket);

    this.socket.on('data', this._onSocketData.bind(this));

    common.forwardMultipleEvents(this.socket, this, ['error', 'close']);
  }

  // returns underlying socket
  //
  getRawTransport() {
    return this.socket;
  }

  // Send data over the connection
  //   data - Buffer or string
  //
  send(data) {
    this.socket.cork();
    this.socket.write(data);
    this.socket.write(SEPARATOR);
    process.nextTick(this._uncorkSocket);
  }

  // End the connection optionally sending the last chunk of data
  //   data - Buffer or string (optional)
  //
  end(data) {
    if (data) {
      this.socket.cork();
      this.socket.write(data);
      this.socket.end(SEPARATOR);
    } else {
      this.socket.end();
    }
  }

  // Socket data handler
  //   data - data received
  //
  _onSocketData(chunk) {
    const messages = [];
    let parsedLength;
    let newPartLength;

    if (this._buffer) {
      newPartLength = chunk.indexOf(0);
      if (newPartLength === -1) {
        this._buffer = Buffer.concat(
          [this._buffer, chunk],
          this._buffer.length + chunk.length
        );
        this._checkBufferSize();
        return;
      }
      if (!this._parseRemains(chunk.slice(0, newPartLength), newPartLength)) {
        return;
      }
      chunk = chunk.slice(newPartLength + 1);
      this._buffer = null;
    }

    try {
      parsedLength = serde.parseNetworkMessages(chunk, messages);
    } catch (error) {
      this.socket.destroy(error);
      return;
    }

    if (chunk.length !== parsedLength) {
      this._buffer = chunk.slice(parsedLength);
    }

    const messagesCount = messages.length;
    for (let i = 0; i < messagesCount; i++) {
      this.emit('message', messages[i]);
    }

    if (this._buffer) {
      this._checkBufferSize();
    }
  }

  _parseRemains(newPart, newPartLength) {
    let result;
    const buffer = Buffer.concat(
      [this._buffer, newPart],
      this._buffer.length + newPartLength
    );
    try {
      result = serde.parse(buffer);
    } catch (error) {
      this.socket.destroy(error);
      return false;
    }
    this.emit('message', result);
    return true;
  }

  _checkBufferSize() {
    if (this._buffer.length > MAX_MESSAGE_SIZE) {
      this.emit('error', new Error('Maximal message size exceeded'));
    }
  }
}

const socketFactory = (connect) => {
  const resultConnectFn = (...options) => {
    const callback = common.extractCallback(options);
    const socket = connect(...options);
    const onceErrorListener = (error) => {
      if (error.code !== 'EAGAIN') {
        callback(error);
        return;
      }
      process.nextTick(resultConnectFn, ...options, callback);
    };
    socket.once('error', onceErrorListener);
    socket.once('connect', () => {
      socket.removeListener('error', onceErrorListener);
      callback(null, socket);
    });
  };
  return resultConnectFn;
};

// Create a function that will be bound to socketFactory that will
// produce JSTP connection bound to a socket created with socketFactory.
//   connect - function that will be called with ...options
//             and must return object that emits events 'connect' and 'error'
//
// see transportCommon.newConnectFn
//
const newConnectFn = (connect, transportName) => transportCommon.newConnectFn(
  socketFactory(connect), Transport, transportName
);

// Same as newConnectFn but will also perform inspect of specified
// interfaces.
//
// see transportCommon.newConnectAndInspectFn
//
const newConnectAndInspectFn =
    (connect, transportName) => transportCommon.newConnectAndInspectFn(
      socketFactory(connect), Transport, transportName
    );

// Same as newConnectFn but will instead perform reconnect on existing
// connection.
//
// see transportCommon.newReconnectFn
//
const newReconnectFn = connect => transportCommon.newReconnectFn(
  socketFactory(connect), Transport
);

module.exports = {
  Transport,
  newConnectFn,
  newConnectAndInspectFn,
  newReconnectFn,
};
