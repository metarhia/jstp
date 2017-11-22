'use strict';

const uuid4 = require('uuid/v4');

// JSTP Session class used to buffer and resend the messages on unexpected
// connection closes.
// Extends Map class and thus can be used to store the current session state
// independently of connection.
class Session extends Map {
  //   connection - Connection class object
  //   sessionId - used on client to represent session with corresponding id
  //               which exists on the server
  constructor(connection, sessionId) {
    super();

    this.id = sessionId || uuid4();
    this.connection = connection;
    this.username = null;

    this.guaranteedDeliveredCount = 0;
    this.buffer = new Map();

    this.recievedCount = 0;
    this.latestBufferedMessageId = 0;

    Object.preventExtensions(this);
  }

  unbufferUpTo(id) {
    for (let i = this.guaranteedDeliveredCount + 1; i <= id; i++) {
      this.buffer.delete(i);
    }
  }

  _bufferMessage(id, message) {
    this.buffer.set(Math.abs(id), message);
    this.latestBufferedMessageId = id;
  }

  _onMessageRecieved(messageId) {
    this.recievedCount = Math.abs(messageId);
  }

  _onCallbackMessageRecieved(messageId) {
    messageId = Math.abs(messageId);
    for (let i = this.guaranteedDeliveredCount + 1; i <= messageId; i++) {
      this.buffer.delete(i);
    }
    this.guaranteedDeliveredCount = messageId;
  }

  _restoreSession(newConnection, recievedCount) {
    if (this.connection) {
      this.connection.close();
    }
    this.unbufferUpTo(recievedCount);
    this.connection = newConnection;
    this.guaranteedDeliveredCount = recievedCount;
  }

  _resendBufferedMessages() {
    this.buffer.forEach((message) => {
      this.connection._send(message);
    });
  }
}

module.exports = Session;
