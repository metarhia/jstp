'use strict';

const uuid4 = require('uuid/v4');

const errors = require('./errors');

// JSTP Session class used to buffer and resend the messages on unexpected
// connection closes.
// Extends Map class and thus can be used to store the current session state
// independently of connection.
//
class Session extends Map {
  //   connection - Connection class object
  //   username - user's username obtained during authentication
  //   sessionId - used on client to represent session with corresponding id
  //               which exists on the server
  //   state - Map object that can be provided to initialize session state
  //
  constructor(connection, username, sessionId, state) {
    super(state);

    this.id = sessionId || uuid4();
    this.connection = connection;
    this.username = username;

    this.guaranteedDeliveredCount = 0;
    this.buffer = new Map();

    this.receivedCount = 0;
    this.latestBufferedMessageId = 0;

    Object.preventExtensions(this);
  }

  // Convert Session object to string.
  // Must be used by implementers of external storage provider
  // for Session objects when exporting the Session objects.
  //
  toString() {
    const copy = { ...this };
    copy.storage = Array.from(this);
    function replacer(key, value) {
      switch (key) {
        case 'connection':
          return undefined;
        case 'buffer':
          return Array.from(value);
        default:
          return value;
      }
    }
    return JSON.stringify(copy, replacer);
  }

  // Restore Session object from string created by toString method.
  // Must be used by implementers of external storage provider
  // for Session objects when importing the Session objects.
  //   sessionString - session object stringified by toString method
  //
  static fromString(sessionString) {
    const reviver = (key, value) =>
      key === 'buffer' || key === 'storage' ? new Map(value) : value;
    const session = JSON.parse(sessionString, reviver);
    const result = new Session(null, null, null, session.storage);
    delete session.storage;
    return Object.assign(result, session);
  }

  _bufferMessage(id, message) {
    this.buffer.set(Math.abs(id), message);
    this.latestBufferedMessageId = id;
  }

  _onMessageReceived(messageId) {
    this.receivedCount = Math.abs(messageId);
  }

  _onCallbackMessageReceived(messageId) {
    messageId = Math.abs(messageId);
    for (let i = this.guaranteedDeliveredCount + 1; i <= messageId; i++) {
      this.buffer.delete(i);
    }
    this.guaranteedDeliveredCount = messageId;
  }

  _restore(newConnection, receivedCount) {
    if (
      this.connection &&
      this.connection.server &&
      this.connection.transport
    ) {
      this.connection.transport.end();
    }
    this.connection = newConnection;
    for (let i = this.guaranteedDeliveredCount + 1; i <= receivedCount; i++) {
      this.buffer.delete(i);
      const id = this.connection._getCallbackId(i);
      const callback = this.connection._callbacks.get(id);
      if (callback) {
        this.connection._callbacks.delete(id);
        process.nextTick(() => {
          callback(errors.ERR_CALLBACK_LOST);
        });
      }
    }
    this.guaranteedDeliveredCount = receivedCount;
  }

  _resendBufferedMessages() {
    this.buffer.forEach(message => {
      this.connection._send(message);
    });
  }
}

module.exports = Session;
