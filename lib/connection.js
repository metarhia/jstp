'use strict';

const { EventEmitter } = require('events');
const semver = require('semver');
const mdsf = require('mdsf');

const common = require('./common');
const errors = require('./errors');
const RemoteProxy = require('./remote-proxy');
const Session = require('./session');

// Object referencing different transports to allow user to provide
// different transport on reconnection. This is forward declaration, the
// definition is below the `module.exports` to avoid circular referencing
// issues.
//
let transports = null;

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

    this.server = server;
    this.client = client;

    this.id = nextConnectionId++;

    if (!client && !server) {
      throw new Error('Either server or client is required');
    }
    this._messageIdDelta = server ? -1 : 1;

    this._callbacks = new Map();

    this.username = null;
    this.session = null;

    this.application = null;
    this.remoteProxies = {};

    this._heartbeatTimer = null;

    this.closedIntentionally = false;

    // Defined in constructor to be used as default callback in callMethod
    // without binding it.
    this._emitError = error => {
      if (error) this.emit('error', error);
    };

    this._transportListeners = {
      message: this._processMessage.bind(this),
      close: this._onSocketClose.bind(this),
      error: this._onSocketError.bind(this),
    };

    this._initTransport(transport);

    if (!this.client) return;
    this.once('close', () => this._reconnectHandler());
  }

  _initTransport(transport) {
    this._nextMessageId = 0;
    this.transport = transport;
    this.remoteAddress = transport.getRawTransport().remoteAddress;
    this.handshakeDone = false;
    this._closed = false;

    Object.keys(this._transportListeners).forEach(event => {
      transport.on(event, this._transportListeners[event]);
    });
  }

  _reconnectHandler() {
    const reconnectFn = (...options) => {
      let transport = options[0];
      if (typeof transport !== 'string' || !transports[transport]) {
        transport = this.client._connectionTransport;
      }
      const callback = common.extractCallback(options) || (() => {});
      if (options.length === 0) {
        options = this.client._connectionOptions;
      }
      this.emit('reconnectAttempt', transport, ...options);
      transports[transport].reconnect(this, ...options, (err, ...rest) => {
        this.emit('reconnect', err);
        callback(err, ...rest);
        if (err) {
          this.client.reconnector(this, reconnectFn);
          return;
        }
        this.once('close', () => this._reconnectHandler());
      });
    };
    this.client.reconnector(this, reconnectFn);
  }

  _removeTransport() {
    Object.keys(this._transportListeners).forEach(event => {
      this.transport.removeListener(
        event, this._transportListeners[event]
      );
    });
    const removedTransport = this.transport;
    this.transport = null;
    return removedTransport;
  }

  _getCallbackId(absId) {
    return absId * this._messageIdDelta;
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
    this._callbacks.set(messageId, callback || this._emitError);
    this._sendWithBuffering(message, messageId);
  }

  // Send a call message over the connection resending if not possible to
  // get a callback.
  //   interfaceName - name of an interface
  //   methodName - name of a method
  //   args - method arguments
  //   callback - callback function that is invoked after a callback message
  //              has been received
  //
  callMethodWithResend(interfaceName, methodName, args, callback) {
    const cb = (error, ...args) => {
      if (error === errors.ERR_CALLBACK_LOST) {
        this.session.connection.callMethodWithResend(
          interfaceName, methodName, args, callback
        );
        return;
      }
      callback(error, ...args);
    };
    this.callMethod(interfaceName, methodName, args, cb);
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

    this._send(this._prepareMessage(message), message);
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
    this._sendWithBuffering(message, message.event[0]);
  }

  // Send a handshake message over the connection
  //   app - string or object, application to connect to as 'name' or
  //         'name@version' or { name, version }, where version
  //         must be a valid semver range
  //   login - user name or Session object (password should be omitted
  //           in this case) (optional)
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
    let isNewSession = true;
    let handshakeStrategy, handshakeCredentials;

    if (login) {
      if (!password) {
        this.session = login;
        handshakeStrategy = 'session';
        handshakeCredentials = [this.session.id, this.session.receivedCount];
        isNewSession = false;
      } else {
        handshakeStrategy = 'login';
        handshakeCredentials = [login, password];
      }
    }

    if (version) {
      message = this._createMessageWithArray(
        'handshake', [name, version], handshakeStrategy, handshakeCredentials
      );
    } else {
      message = this._createMessage(
        'handshake', name, handshakeStrategy, handshakeCredentials
      );
    }

    const messageId = message.handshake[0];
    let cb;
    if (isNewSession) {
      cb = (error, sessionId) => {
        if (!error) {
          if (login && password) {
            this.username = login;
          }
          this.session = new Session(this, this.username, sessionId);
        }
        if (callback) {
          callback(error, this.session);
        }
      };
    } else {
      cb = (error, receivedCount) => {
        if (!error) {
          this.session._restore(this, receivedCount);
          this.session._resendBufferedMessages();
          this._nextMessageId = this.session.latestBufferedMessageId + 1;
        }
        if (callback) {
          callback(error);
        }
      };
    }
    this._callbacks.set(messageId, cb);

    this._send(this._prepareMessage(message), message);
  }

  // Send an inspect message over the connection
  //   interfaceName - name of an interface to inspect
  //   callback - callback function to invoke after another side responds
  //              with interface introspection
  //
  inspectInterface(interfaceName, callback) {
    const message = this._createMessage('inspect', interfaceName, null, null);
    const messageId = message.inspect[0];

    this._callbacks.set(messageId, (error, ...methods) => {
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
    });

    this._sendWithBuffering(message, messageId);
  }

  // Send a ping message
  //
  ping(callback) {
    const message = this._createMessage('ping');
    const messageId = message.ping[0];
    this._callbacks.set(messageId, callback || common.doNothing);
    this._sendWithBuffering(message, messageId);
  }

  // Send a pong message
  //
  _pong(messageId) {
    if (this._closed) {
      return;
    }
    const message = { pong: [messageId] };
    this._send(this._prepareMessage(message), message);
  }

  // Start sending ping messages
  //   interval - heartbeat interval in milliseconds
  //
  startHeartbeat(interval) {
    const heartbeat = () => {
      if (!this._closed) {
        this.ping();
      }
    };

    this._heartbeatTimer = setInterval(heartbeat, interval);
  }

  // Stop sending ping messages
  //
  stopHeartbeat() {
    if (this._heartbeatTimer) {
      clearTimeout(this._heartbeatTimer);
      this._heartbeatTimer = null;
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
    this._closed = true;
    this.closedIntentionally = true;
    this.stopHeartbeat();
    this.transport.end();
  }

  // Returns underlying transport
  //
  getTransport() {
    return this.transport.getRawTransport();
  }

  // Prepare a JSTP message to be sent over this connection
  //   message - a message to prepare
  //
  _prepareMessage(message) {
    return mdsf.stringify(message);
  }

  _restorePreparedMessage(preparedMessage) {
    return mdsf.parse(preparedMessage);
  }

  _sendWithBuffering(message, messageId) {
    const preparedMessage = this._prepareMessage(message);
    this._send(preparedMessage, message);
    this.session._bufferMessage(messageId, preparedMessage);
  }

  // Send a JSTP message over this connection
  //   preparedMessage - a prepared message to send
  //   message - a message object (used for development events thus optional)
  //
  _send(preparedMessage, message) {
    if (this._closed) return;
    this.transport.send(preparedMessage);

    if (process.env.NODE_ENV !== 'production') {
      this._emitEventForLogging(
        'outgoingMessage',
        message || this._restorePreparedMessage(preparedMessage)
      );
    }
  }

  // Close the connection, optionally sending a final message
  //   message - a message to send (optional)
  //
  _end(message) {
    this._closed = true;
    this.stopHeartbeat();

    if (message) {
      const data = mdsf.stringify(message);
      this.transport.end(data);

      if (process.env.NODE_ENV !== 'production') {
        this._emitEventForLogging('outgoingMessage', message);
      }
    } else {
      this.transport.end();
    }
  }

  // Closed socket event handler
  //
  _onSocketClose() {
    this._closed = true;
    this.stopHeartbeat();
    this.emit('close', this);
    if (this.server && this.transport) {
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
        this._emitEventForLogging('heartbeat', message);
      }
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      this._emitEventForLogging('incomingMessage', message);
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
    this._emitEventForLogging('messageRejected', message);

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
    this.requestedVersion = message.handshake[2];
    const application = this.server._getApplication(
      applicationName, this.requestedVersion
    );

    if (!application) {
      this._handshakeError(errors.ERR_APP_NOT_FOUND);
      return;
    }

    if (!this.requestedVersion) {
      this.requestedVersion = semver.major(application.version).toString();
    }

    this.application = application;

    let authStrategy = keys[1];
    const credentials = authStrategy && message[authStrategy];
    authStrategy = authStrategy || 'anonymous';

    if (authStrategy !== 'session') {
      this.server.startSession(
        this, application, authStrategy, credentials,
        this._onSessionCreated.bind(this)
      );
    } else {
      this.server.restoreSession(
        this, application, credentials,
        this._onSessionRestored.bind(this)
      );
    }
    this.server.emit('handshakeRequest', this, applicationName, authStrategy);
  }

  // Callback of session creation operation
  //   error - error that has occurred or null
  //   username - user login or null
  //   session - session object
  //
  _onSessionCreated(error, username, session) {
    if (error) {
      this._handshakeError(error);
      return;
    }

    this.username = username;
    this.session = session;
    this.handshakeDone = true;

    this.emit('client', session, this);
    this.server.emit('connect', this);

    const message = this._createMessage('handshake', null, 'ok', session.id);
    this._send(this._prepareMessage(message), message);
  }

  // Callback of session restoration operation
  //   error - error that has occured or null
  //   username - user login or null
  //   session - session object
  //
  _onSessionRestored(error, username, session) {
    if (error) {
      this._handshakeError(error);
      return;
    }

    this.username = username;
    this.session = session;
    this.handshakeDone = true;

    this.emit('client', session, this);
    this.server.emit('reconnect', this);

    const message = this._createMessage(
      'handshake', null, 'ok', session.receivedCount
    );
    this._send(this._prepareMessage(message), message);
    this.session._resendBufferedMessages();
    this._nextMessageId = this.session.latestBufferedMessageId + 1;
  }

  // Process incoming handshake message which is a handshake response
  //   message - parsed message
  //
  _processHandshakeResponse(message) {
    const messageId = message.handshake[0];
    const callback = this._callbacks.get(messageId);

    this._emitEventForLogging('handshake', message.error, message.ok);

    if (!callback) {
      this._rejectMessage(message);
    }

    if (message.ok !== undefined) {
      this._callbacks.delete(messageId);

      this.handshakeDone = true;
      this.application = this.client.application;

      callback(null, message.ok);
    } else if (message.error) {
      this._callbacks.delete(messageId);
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

    this.session._onMessageReceived(messageId);

    if (!args) {
      callback(errors.ERR_INVALID_SIGNATURE);
      return;
    }

    this._emitEventForLogging('call', interfaceName, methodName, args);

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
    const callback = this._callbacks.get(messageId);

    this._emitEventForLogging('callback', message.error, message.ok);
    this.session._onCallbackMessageReceived(messageId);

    if (callback) {
      this._callbacks.delete(messageId);

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

    this._emitEventForLogging('event', interfaceName, eventName, eventArgs);
    this.session._onMessageReceived(message.event[0]);

    if (!Array.isArray(eventArgs)) {
      this._rejectMessage(message);
      return;
    }

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

    this._emitEventForLogging('inspect', interfaceName);
    this.session._onMessageReceived(messageId);

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
    const messageId = message.ping[0];
    this._pong(messageId);
    this.session._onMessageReceived(messageId);
  }

  // Process incoming pong message
  //   message - parsed message
  //
  _processPongMessage(message) {
    const messageId = message.pong[0];
    this.session._onCallbackMessageReceived(messageId);

    const callback = this._callbacks.get(messageId);
    if (callback) {
      this._callbacks.delete(messageId);
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

  _emitEventForLogging(event, ...args) {
    if (this.client && this.client.logger) {
      this.client.logger.emit(event, ...args);
    } else {
      this.emit(event, ...args);
    }
    if (this.server) {
      this.server.emit('log', this, event, ...args);
    }
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

transports = {
  'net': require('./net'),
  'tls': require('./tls'),
  'ws': require('./ws'),
};
