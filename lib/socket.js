'use strict';

const { EventEmitter } = require('events');

const transportCommon = require('./transport-common');
const jsrs = require('./record-serialization');
const common = require('./common');

const SEPARATOR = Buffer.alloc(1);
const MAX_PACKET_SIZE = 8 * 1024 * 1024;

// JSTP transport for POSIX socket
//
class Transport extends EventEmitter {
  // Constructs transport instance.
  //   socket - socket instance
  //
  constructor(socket) {
    super();

    this.socket = socket;
    this._buffer = '';
    this._uncorkSocket = this.socket.uncork.bind(this.socket);

    this.socket.setEncoding('utf8');
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
  }
}

const socketFactory = connect => (...options) => {
  const callback = common.extractCallback(options);
  const socket = connect(...options);
  socket.once('error', callback);
  socket.once('connect', () => {
    socket.removeListener('error', callback);
    callback(null, socket);
  });
};

// Create a function that will be bound to socketFactory that will
// produce JSTP connection bound to a socket created with socketFactory.
//   connect - function that will be called with ...options
//             and must return object that emits events 'connect' and 'error'
//
// see transportCommon.newConnectFn
//
const newConnectFn = connect =>
  transportCommon.newConnectFn(socketFactory(connect), Transport);

// Same as newConnectFn but will also perform inspect of specified
// interfaces.
//
// see transportCommon.newConnectAndInspectFn
//
const newConnectAndInspectFn = connect =>
  transportCommon.newConnectAndInspectFn(socketFactory(connect), Transport);

module.exports = {
  Transport,
  newConnectFn,
  newConnectAndInspectFn
};
