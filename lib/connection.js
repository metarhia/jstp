'use strict';

const { EventEmitter } = require('events');
const semver = require('semver');
const timers = require('timers');

const common = require('./common');
const serde = require('./serde');
const errors = require('./errors');
const RemoteProxy = require('./remote-proxy');

let nextConnectionId = 0;

// Mapping of message types to handler function names (forward declaration, see
// definition below the Connection class).
//
let MESSAGE_HANDLERS = null;

// JSTP connection class
//   transport - an abstract socket
//   server - JSTP server instance, used only for server-side parts
//            of connections (optional, but either server or client
//            is required)
//   client - JSTP client instance, used only for client-side parts
//            of connections (optional, but either server or client
//            is required)
//
class Connection extends EventEmitter {
  constructor(transport, server, client) {
    super();

    this.transport = transport;
    this.server = server;
    this.client = client;

    this.id = nextConnectionId++;
    this._nextMessageId = 0;

    if (!client && !server) {
      throw new Error('Either server or client is required');
    }
    this._messageIdDelta = server ? -1 : 1;

    this.remoteAddress = transport.remoteAddress;

    this._callbacks = {};

    this.handshakeDone = false;
    this.username = null;
    this.sessionId = null;

    this.application = null;
    this.remoteProxies = {};

    this._heartbeatCallbackInstance = null;

    // Defined in constructor to be used as default callback in callMethod
    // without binding it.
    this._emitError = (error) => {
      if (error) this.emit('error', error);
    };

    // Defined in constructor to be used as heartbeat message
    // in debug mode events
    this._heartbeatMessage = {};

    transport.on('message', this._processMessage.bind(this));
    transport.on('close', this._onSocketClose.bind(this));
    transport.on('error', this._onSocketError.bind(this));
  }

  // Send a call message over the connection
  //   interfaceName - name of an interface
  //   methodName - name of a method
  //   args - method arguments
  //   callback - callback function that is invoked after a callback message
  //     has been received
  //
  callMethod(interfaceName, methodName, args, callback) {
    const message = this._createMessage(
      'call', interfaceName, methodName, args
    );
    const messageId = message.call[0];
    this._callbacks[messageId] = callback || this._emitError;
    this._send(message);
  }

  // Send a callback message over the connection
  //   messageId - id of a call message to send callback message for
  //   error - error that has occured or null
  //   result - result of a remote method if there was no error
  //
  _callback(messageId, error, result) {
    let message;

    if (error) {
      error = errors.RemoteError.getJstpArrayFor(error);
      message = this._createMessage('callback', null, 'error', error);
    } else {
      message = this._createMessage('callback', null, 'ok', result);
    }

    message.callback[0] = messageId;

    this._send(message);
  }

  // Send an event message over the connection
  //   interfaceName - name of an interface
  //   eventName - name of an event
  //   args - event arguments as an array
  //
  emitRemoteEvent(interfaceName, eventName, args) {
    const message = this._createMessage(
      'event', interfaceName, eventName, args
    );
    this._send(message);
  }

  // Send a handshake message over the connection
  //   app - string or object, application to connect to as 'name' or
  //         'name@version' or { name, version }, where version
  //         must be a valid semver range
  //   login - user name (optional)
  //   password - user password (optional)
  //   callback - callback function to invoke after the handshake is completed
  //
  handshake(app, login, password, callback) {
    let name, version;
    if (typeof app === 'string') {
      [name, version] = common.rsplit(app, '@');
    } else {
      name = app.name;
      version = app.version;
    }

    if (version && !semver.validRange(version)) {
      const error = new Error('Invalid semver version range');
      if (callback) {
        callback(error);
      } else {
        this.emit('error', error);
      }
      return;
    }

    let message;
    if (version) {
      message = login && password ?
        this._createMessageWithArray(
          'handshake', [name, version], 'login', [login, password]
        ) :
        this._createMessageWithArray(
          'handshake', [name, version]
        );
    } else {
      message = login && password ?
        this._createMessage('handshake', name, 'login', [login, password]) :
        this._createMessage('handshake', name);
    }

    const messageId = message.handshake[0];
    this._callbacks[messageId] = (error, sessionId) => {
      if (login && password && !error) {
        this.username = login;
      }
      this.sessionId = sessionId;
      if (callback) {
        callback(error, sessionId);
      }
    };

    this._send(message);
  }

  // Send an inspect message over the connection
  //   interfaceName - name of an interface to inspect
  //   callback - callback function to invoke after another side responds
  //              with interface introspection
  //
  inspectInterface(interfaceName, callback) {
    const message = this._createMessage('inspect', interfaceName, null, null);
    const messageId = message.inspect[0];

    this._callbacks[messageId] = (error, ...methods) => {
      if (error) {
        if (callback) {
          callback(error);
        } else {
          this.emit('error', error);
        }
        return;
      }

      const proxy = new RemoteProxy(this, interfaceName, methods);
      this.remoteProxies[interfaceName] = proxy;

      if (callback) {
        callback(null, proxy);
      }
    };

    this._send(message);
  }

  // Send a ping message
  //
  ping(callback) {
    const message = this._createMessage('ping');
    const messageId = message.ping[0];
    this._callbacks[messageId] = callback || common.doNothing;
    this._send(message);
  }

  // Send a pong message
  //
  pong(messageId) {
    const message = { pong: [messageId] };
    this._send(message);
  }

  // Start sending heartbeat messages
  //   interval - heartbeat interval in milliseconds
  //
  startHeartbeat(interval) {
    const callback = () => {
      this.transport.send('{}');
      this.setTimeout(interval, this._heartbeatCallbackInstance);

      if (process.env.NODE_ENV !== 'production') {
        this.emit('heartbeat', this._heartbeatMessage);
      }
    };

    this._heartbeatCallbackInstance = callback;
    callback();
  }

  // Stop sending heartbeat messages
  //
  stopHeartbeat() {
    if (this._heartbeatCallbackInstance) {
      this.clearTimeout(this._heartbeatCallbackInstance);
      this._heartbeatCallbackInstance = null;
    }
  }

  // Create a JSTP message
  //   kind - message kind
  //   target - array of arguments for kind key, usually a name
  //            of an interface or an application (optional)
  //            with api version
  //   verb - action specific for different message kinds
  //   args - action arguments
  //
  _createMessageWithArray(kind, target, verb, args) {
    const message = {
      [kind]: [this._nextMessageId, ...target],
    };

    if (verb) {
      message[verb] = args;
    }

    this._nextMessageId += this._messageIdDelta;

    return message;
  }

  // Create a JSTP message
  //   kind - message kind
  //   target - name of an interface or an application (optional)
  //   verb - action specific for different message kinds
  //   args - action arguments
  //
  _createMessage(kind, target, verb, args) {
    const message = {
      [kind]: (
        target ? [this._nextMessageId, target] : [this._nextMessageId]
      ),
    };

    if (verb) {
      message[verb] = args;
    }

    if (kind !== 'callback') {
      this._nextMessageId += this._messageIdDelta;
    }

    return message;
  }

  // Close the connection
  //
  close() {
    this.stopHeartbeat();
    this.transport.end();
  }

  // Set a timeout using timers.enroll()
  //   milliseconds - amount of milliseconds
  //   callback - callback function
  //
  setTimeout(milliseconds, callback) {
    timers.enroll(this, milliseconds);
    timers._unrefActive(this);
    this.once('_timeout', callback);
  }

  // Clear a timeout set with Connection#setTimeout
  //   handler - timer callback to remove
  //
  clearTimeout(handler) {
    timers.unenroll(this);
    this.removeListener('_timeout', handler);
  }

  // Returns underlying transport
  //
  getTransport() {
    return this.transport.getRawTransport();
  }

  // timers.enroll() timeout handler
  //
  _onTimeout() {
    this.emit('_timeout');
  }

  // Send a JSTP message over this connection
  //   message - a message to send
  //
  _send(message) {
    const data = serde.stringify(message);
    this.transport.send(data);

    if (process.env.NODE_ENV !== 'production') {
      this.emit('outgoingMessage', message);
    }
  }

  // Close the connection, optionally sending a final message
  //   message - a message to send (optional)
  //
  _end(message) {
    this.stopHeartbeat();

    if (message) {
      const data = serde.stringify(message);
      this.transport.end(data);

      if (process.env.NODE_ENV !== 'production') {
        this.emit('outgoingMessage', message);
      }
    } else {
      this.transport.end();
    }
  }

  // Closed socket event handler
  //
  _onSocketClose() {
    this.stopHeartbeat();
    this.emit('close', this);
    if (this.server) {
      this.server.emit('disconnect', this);
    }
  }

  // Socket error event handler
  //   error - error that has occured
  //
  _onSocketError(error) {
    this._end();
    this.emit('error', error, this);
  }

  // Process parsed incoming message
  //   message - parsed incoming message
  //
  _processMessage(message) {
    const keys = Object.keys(message);
    if (keys.length === 0) {
      // heartbeat message
      if (process.env.NODE_ENV !== 'production') {
        this.emit('heartbeat', message);
      }
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      this.emit('incomingMessage', message);
    }

    const kind = keys[0];
    if (!this.handshakeDone && kind !== 'handshake') {
      this._rejectMessage(message, true);
      return;
    }

    const handler = MESSAGE_HANDLERS[kind];
    if (handler) {
      handler.call(this, message, keys);
    } else {
      this._rejectMessage(message);
    }
  }

  // Reject incoming message
  //   message - rejected message
  //   fatal - if true, close the connection
  //
  _rejectMessage(message, fatal) {
    this.emit('messageRejected', message, this);

    if (fatal) {
      this._end();
    }
  }

  // Process incoming handshake message
  //   message - parsed message
  //   keys - array of message keys
  //
  _processHandshakeMessage(message, keys) {
    if (this.handshakeDone) {
      this._rejectMessage(message, true);
      return;
    }

    if (message.handshake[1]) {  // if there is an application name
      this._processHandshakeRequest(message, keys);
    } else {
      this._processHandshakeResponse(message, keys);
    }
  }

  // Process incoming handshake message which is a handshake request
  //   message - parsed message
  //   keys - array of message keys
  //
  _processHandshakeRequest(message, keys) {
    if (!this.server) {
      this._handshakeError(errors.ERR_NOT_A_SERVER);
      return;
    }

    const applicationName = message.handshake[1];
    const applicationVersion = message.handshake[2];
    const application = this.server._getApplication(
      applicationName, applicationVersion
    );

    if (!application) {
      this._handshakeError(errors.ERR_APP_NOT_FOUND);
      return;
    }

    this.application = application;

    let authStrategy = keys[1];
    const credentials = authStrategy && message[authStrategy];
    authStrategy = authStrategy || 'anonymous';

    this.server.startSession(
      this, application, authStrategy, credentials,
      this._onSessionCreated.bind(this)
    );

    this.server.emit('handshakeRequest', this, applicationName, authStrategy);
  }

  // Callback of authentication operation
  //   error - error that has occured or null
  //   username - user login or null
  //   sessionId - session id
  //
  _onSessionCreated(error, username, sessionId) {
    if (error) {
      this._handshakeError(errors.ERR_AUTH_FAILED);
      return;
    }

    this.username = username;
    this.handshakeDone = true;
    this.sessionId = sessionId;

    this.emit('client', sessionId, this);
    this.server.emit('connect', this);

    const message = this._createMessage('handshake', null, 'ok', sessionId);
    this._send(message);
  }

  // Process incoming handshake message which is a handshake response
  //   message - parsed message
  //
  _processHandshakeResponse(message) {
    const messageId = message.handshake[0];
    const callback = this._callbacks[messageId];

    this.emit('handshake', message.error, message.ok);

    if (!callback) {
      this._rejectMessage(message);
    }

    if (message.ok) {
      delete this._callbacks[messageId];

      this.handshakeDone = true;
      this.application = this.client.application;

      callback(null, message.ok);
    } else if (message.error) {
      delete this._callbacks[messageId];
      callback(errors.RemoteError.fromJstpArray(message.error));
    } else {
      this._rejectMessage(message, true);
    }
  }

  // End the connection with handshake error
  //   error - error that has occured
  //
  _handshakeError(error) {
    const normalizedError = errors.RemoteError.getJstpArrayFor(error);
    const message = this._createMessage(
      'handshake', null, 'error', normalizedError
    );

    this._end(message);
  }

  // Process incoming call message
  //   message - parsed message
  //   keys - array of message keys
  //
  _processCallMessage(message, keys) {
    const messageId = message.call[0];
    const interfaceName = message.call[1];
    const methodName = keys[1];
    const args = message[methodName];

    const callback = this._remoteCallbackWrapper.bind(this, messageId);

    if (!args) {
      callback(errors.ERR_INVALID_SIGNATURE);
      return;
    }

    this.emit('call', interfaceName, methodName, args);

    try {
      this.application.callMethod(
        this, interfaceName, methodName, args, callback
      );
    } catch (error) {
      callback(errors.ERR_INTERNAL_API_ERROR);
      throw error;
    }
  }

  // Process incoming callback message
  //   message - parsed message
  //
  _processCallbackMessage(message) {
    const messageId = message.callback[0];
    const callback = this._callbacks[messageId];

    this.emit('callback', message.error, message.ok);

    if (callback) {
      delete this._callbacks[messageId];

      if (message.ok) {
        callback(null, ...message.ok);
        return;
      } else if (message.error) {
        callback(errors.RemoteError.fromJstpArray(message.error));
        return;
      }
    }
    this._rejectMessage(message);
  }

  // Process incoming event message
  //   message - parsed message
  //   keys - array of message keys
  //
  _processEventMessage(message, keys) {
    const interfaceName = message.event[1];
    const eventName = keys[1];
    const eventArgs = message[eventName];

    this.emit('event', interfaceName, eventName, eventArgs);

    const remoteProxy = this.remoteProxies[interfaceName];
    if (remoteProxy) {
      remoteProxy._emitLocal(eventName, eventArgs);
    }

    if (this.application && this.application.handleEvent) {
      this.application.handleEvent(this, interfaceName, eventName, eventArgs);
    }
  }

  // Process incoming inspect message
  //   message - parsed message
  //
  _processInspectMessage(message) {
    const messageId = message.inspect[0];
    const interfaceName = message.inspect[1];

    this.emit('inspect', interfaceName);

    const methods = this.application.getMethods(interfaceName);
    if (methods) {
      this._callback(messageId, null, methods);
    } else {
      this._callback(messageId, errors.ERR_INTERFACE_NOT_FOUND);
    }
  }

  // Process incoming ping message
  //   message - parsed message
  //
  _processPingMessage(message) {
    this.pong(message.ping[0]);
  }

  // Process incoming pong message
  //   message - parsed message
  //
  _processPongMessage(message) {
    const messageId = message.pong[0];
    const callback = this._callbacks[messageId];
    if (callback) {
      delete this._callbacks[messageId];
      callback();
    }
  }

  // Callback of functions invoked via call messages
  // Signature: Connection#_remoteCallbackWrapper(messageId, error, ...result)
  //   messageId - id of a message to send callback for
  //   error - error that has occured, if any
  //   result - data to send back as a result
  //
  _remoteCallbackWrapper(messageId, error, ...result) {
    this._callback(messageId, error, result);
  }
}

MESSAGE_HANDLERS = {
  handshake: Connection.prototype._processHandshakeMessage,
  call:      Connection.prototype._processCallMessage,
  callback:  Connection.prototype._processCallbackMessage,
  event:     Connection.prototype._processEventMessage,
  inspect:   Connection.prototype._processInspectMessage,
  ping:      Connection.prototype._processPingMessage,
  pong:      Connection.prototype._processPongMessage,
};

module.exports = Connection;
