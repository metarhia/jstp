'use strict';

const { EventEmitter } = require('events');
const timers = require('timers');

const common = require('./common');
const serde = require('./serde');
const errors = require('./errors');
const RemoteProxy = require('./remote-proxy');

let nextConnectionId = 0;

// Mapping of packet types to handler function names (forward declaration, see
// definition below the Connection class).
//
let PACKET_HANDLERS = null;

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
    this._nextPacketId = 0;

    if (!client && !server) {
      throw new Error('Either server or client is required');
    }
    this._packetIdDelta = server ? -1 : 1;

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

    transport.on('packet', this._processPacket.bind(this));
    transport.on('close', this._onSocketClose.bind(this));
    transport.on('error', this._onSocketError.bind(this));
  }

  // Send a call packet over the connection
  //   interfaceName - name of an interface
  //   methodName - name of a method
  //   args - method arguments
  //   callback - callback function that is invoked after a callback packet
  //     has been received
  //
  callMethod(interfaceName, methodName, args, callback) {
    const packet = this._createPacket('call', interfaceName, methodName, args);
    const packetId = packet.call[0];
    this._callbacks[packetId] = callback || this._emitError;
    this._send(packet);
  }

  // Send a callback packet over the connection
  //   packetId - id of a call packet to send callback packet for
  //   error - error that has occured or null
  //   result - result of a remote method if there was no error
  //
  callback(packetId, error, result) {
    let packet;

    if (error) {
      error = errors.RemoteError.getJstpArrayFor(error);
      packet = this._createPacket('callback', null, 'error', error);
    } else {
      packet = this._createPacket('callback', null, 'ok', result);
    }

    packet.callback[0] = packetId;

    this._send(packet);
  }

  // Send an event packet over the connection
  //   interfaceName - name of an interface
  //   eventName - name of an event
  //   args - event arguments as an array
  //
  emitRemoteEvent(interfaceName, eventName, args) {
    const packet = this._createPacket('event', interfaceName, eventName, args);
    this._send(packet);
  }

  // Send a handshake packet over the connection
  //   appName - name of an application to connect to
  //   login - user name (optional)
  //   password - user password (optional)
  //   callback - callback function to invoke after the handshake is completed
  //
  handshake(appName, login, password, callback) {
    const packet = login && password ?
      this._createPacket('handshake', appName, 'login', [login, password]) :
      this._createPacket('handshake', appName);

    const packetId = packet.handshake[0];
    this._callbacks[packetId] = (error, sessionId) => {
      if (login && password && !error) {
        this.username = login;
      }
      this.sessionId = sessionId;
      if (callback) {
        callback(error, sessionId);
      }
    };

    this._send(packet);
  }

  // Send an inspect packet over the connection
  //   interfaceName - name of an interface to inspect
  //   callback - callback function to invoke after another side responds
  //              with interface introspection
  //
  inspectInterface(interfaceName, callback) {
    const packet = this._createPacket('inspect', interfaceName, null, null);
    const packetId = packet.inspect[0];

    this._callbacks[packetId] = (error, ...methods) => {
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

    this._send(packet);
  }

  // Send a ping packet
  //
  ping(callback) {
    const packet = this._createPacket('ping');
    const packetId = packet.ping[0];
    this._callbacks[packetId] = callback || common.doNothing;
    this._send(packet);
  }

  // Send a pong packet
  //
  pong(packetId) {
    const packet = { pong: [packetId] };
    this._send(packet);
  }

  // Start sending heartbeat packets
  //   interval - heartbeat interval in milliseconds
  //
  startHeartbeat(interval) {
    const cb = this._heartbeatCallback.bind(this, interval);
    this._heartbeatCallbackInstance = cb;
    cb();
  }

  // Internal function used by startHeartbeat
  //
  _heartbeatCallback(interval) {
    this.transport.send('{}');
    this.setTimeout(interval, this._heartbeatCallbackInstance);
  }

  // Stop sending heartbeat packets
  //
  stopHeartbeat() {
    if (this._heartbeatCallbackInstance) {
      this.clearTimeout(this._heartbeatCallbackInstance);
      this._heartbeatCallbackInstance = null;
    }
  }

  // Create a JSTP packet
  //   kind - packet kind
  //   target - name of an interface or an application (optional)
  //   verb - action specific for different packet kinds
  //   args - action arguments
  //
  _createPacket(kind, target, verb, args) {
    const packet = {
      [kind]: (
        target ? [this._nextPacketId, target] : [this._nextPacketId]
      )
    };

    if (verb) {
      packet[verb] = args;
    }

    this._nextPacketId += this._packetIdDelta;

    return packet;
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

  // Send a JSTP packet over this connection
  //   packet - a packet to send
  //
  _send(packet) {
    const data = serde.stringify(packet);
    this.transport.send(data);
  }

  // Close the connection, optionally sending a final packet
  //   packet - a packet to send (optional)
  //
  _end(packet) {
    this.stopHeartbeat();

    if (packet) {
      const data = serde.stringify(packet);
      this.transport.end(data);
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

  // Process parsed incoming packets
  //   packets - array of packets
  //
  _processPacket(packet) {
    const keys = Object.keys(packet);
    if (keys.length === 0) return;  // heartbeat packet

    const kind = keys[0];
    if (!this.handshakeDone && kind !== 'handshake') {
      return this._rejectPacket(packet, true);
    }

    const handler = PACKET_HANDLERS[kind];
    if (handler) {
      handler.call(this, packet, keys);
    } else {
      this._rejectPacket(packet);
    }
  }

  // Reject incoming packet
  //   packet - rejected packet
  //   fatal - if true, close the connection
  //
  _rejectPacket(packet, fatal) {
    this.emit('packetRejected', packet, this);

    if (fatal) {
      this._end();
    }
  }

  // Process incoming handshake packet
  //   packet - parsed packet
  //   keys - array of packet keys
  //
  _processHandshakePacket(packet, keys) {
    if (this.handshakeDone) {
      return this._rejectPacket(packet, true);
    }

    if (packet.handshake[1]) {  // if there is an application name
      this._processHandshakeRequest(packet, keys);
    } else {
      this._processHandshakeResponse(packet, keys);
    }
  }

  // Process incoming handshake packet which is a handshake request
  //   packet - parsed packet
  //   keys - array of packet keys
  //
  _processHandshakeRequest(packet, keys) {
    if (!this.server) {
      return this._handshakeError(errors.ERR_NOT_A_SERVER);
    }

    const applicationName = packet.handshake[1];
    const application = this.server.applications[applicationName];

    if (!application) {
      return this._handshakeError(errors.ERR_APP_NOT_FOUND);
    }

    this.application = application;

    let authStrategy = keys[1];
    const credentials = authStrategy && packet[authStrategy];
    authStrategy = authStrategy || 'anonymous';

    this.server.startSession(
      this, application, authStrategy, credentials,
      this._onSessionCreated.bind(this)
    );
  }

  // Callback of authentication operation
  //   error - error that has occured or null
  //   username - user login or null
  //   sessionId - session id
  //
  _onSessionCreated(error, username, sessionId) {
    if (error) {
      return this._handshakeError(errors.ERR_AUTH_FAILED);
    }

    this.username = username;
    this.handshakeDone = true;
    this.sessionId = sessionId;

    this.emit('client', sessionId, this);
    this.server.emit('connect', this);

    const packet = this._createPacket('handshake', null, 'ok', sessionId);
    this._send(packet);
  }

  // Process incoming handshake packet which is a handshake response
  //   packet - parsed packet
  //
  _processHandshakeResponse(packet) {
    const packetId = packet.handshake[0];
    const callback = this._callbacks[packetId];

    if (!callback) {
      this._rejectPacket(packet);
    }

    if (packet.ok) {
      delete this._callbacks[packetId];

      this.handshakeDone = true;
      this.application = this.client.application;

      callback(null, packet.ok);
    } else if (packet.error) {
      delete this._callbacks[packetId];
      callback(errors.RemoteError.fromJstpArray(packet.error));
    } else {
      this._rejectPacket(packet, true);
    }
  }

  // End the connection with handshake error
  //   error - error that has occured
  //
  _handshakeError(error) {
    const normalizedError = errors.RemoteError.getJstpArrayFor(error);
    const packet = this._createPacket(
      'handshake', null, 'error', normalizedError
    );

    this._end(packet);
  }

  // Process incoming call packet
  //   packet - parsed packet
  //   keys - array of packet keys
  //
  _processCallPacket(packet, keys) {
    const packetId = packet.call[0];
    const interfaceName = packet.call[1];
    const methodName = keys[1];
    const args = packet[methodName];

    const callback = this._remoteCallbackWrapper.bind(this, packetId);

    if (!args) {
      return callback(errors.ERR_INVALID_SIGNATURE);
    }

    try {
      this.application.callMethod(
        this, interfaceName, methodName, args, callback
      );
    } catch (error) {
      callback(errors.ERR_INTERNAL_API_ERROR);
      throw error;
    }
  }

  // Process incoming callback packet
  //   packet - parsed packet
  //
  _processCallbackPacket(packet) {
    const packetId = packet.callback[0];
    const callback = this._callbacks[packetId];

    if (callback) {
      delete this._callbacks[packetId];

      if (packet.ok) {
        return callback(null, ...packet.ok);
      } else if (packet.error) {
        return callback(errors.RemoteError.fromJstpArray(packet.error));
      }
    }
    this._rejectPacket(packet);
  }

  // Process incoming event packet
  //   packet - parsed packet
  //   keys - array of packet keys
  //
  _processEventPacket(packet, keys) {
    const interfaceName = packet.event[1];
    const eventName = keys[1];
    const eventArgs = packet[eventName];

    this.emit('event', interfaceName, eventName, eventArgs);

    const remoteProxy = this.remoteProxies[interfaceName];
    if (remoteProxy) {
      remoteProxy._emitLocal(eventName, eventArgs);
    }
  }

  // Process incoming inspect packet
  //   packet - parsed packet
  //
  _processInspectPacket(packet) {
    const packetId = packet.inspect[0];
    const interfaceName = packet.inspect[1];

    const methods = this.application.getMethods(interfaceName);
    if (methods) {
      this.callback(packetId, null, methods);
    } else {
      this.callback(packetId, errors.ERR_INTERFACE_NOT_FOUND);
    }
  }

  // Process incoming ping packet
  //   packet - parsed packet
  //
  _processPingPacket(packet) {
    this.pong(packet.ping[0]);
  }

  // Process incoming pong packet
  //   packet - parsed packet
  //
  _processPongPacket(packet) {
    const packetId = packet.pong[0];
    const callback = this._callbacks[packetId];
    if (callback) {
      delete this._callbacks[packetId];
      callback();
    }
  }

  // Callback of functions invoked via call packets
  // Signature: Connection#_remoteCallbackWrapper(packetId, error, ...result)
  //   packetId - id of a packet to send callback for
  //   error - error that has occured, if any
  //   result - data to send back as a result
  //
  _remoteCallbackWrapper(packetId, error, ...result) {
    this.callback(packetId, error, result);
  }
}

PACKET_HANDLERS = {
  handshake: Connection.prototype._processHandshakePacket,
  call:      Connection.prototype._processCallPacket,
  callback:  Connection.prototype._processCallbackPacket,
  event:     Connection.prototype._processEventPacket,
  inspect:   Connection.prototype._processInspectPacket,
  ping:      Connection.prototype._processPingPacket,
  pong:      Connection.prototype._processPongPacket
};

module.exports = Connection;
