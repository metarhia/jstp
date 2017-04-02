'use strict';

var events = require('events');
var timers = require('timers');
var util = require('util');

var jsrs = require('./record-serialization');
var common = require('./common');
var errors = require('./errors');
var RemoteProxy = require('./remote-proxy');

module.exports = Connection;

var nextConnectionId = 0;

// JSTP connection class
//   transport - an abstract socket
//   server - JSTP server instance, used only for server-side parts
//            of connections (optional, but either server or client
//            is required)
//   client - JSTP client instance, used only for client-side parts
//            of connections (optional, but either server or client
//            is required)
//
function Connection(transport, server, client) {
  events.EventEmitter.call(this);

  this.transport = transport;
  this.server = server;
  this.client = client;

  this.id = nextConnectionId++;
  this._nextPacketId = 0;

  if (server && !client) {
    this._packetIdDelta = -1;
  } else if (client && !server) {
    this._packetIdDelta = 1;
  } else {
    throw new Error('Either server or client is required');
  }

  this.remoteAddress = transport.remoteAddress;

  this._callbacks = {};

  this.handshakeDone = false;
  this.username = null;
  this.sessionId = null;

  this.application = null;
  this.remoteProxies = {};

  this._heartbeatCallbackInstance = null;

  transport.on('packet', this._processPacket.bind(this));
  transport.on('close', this._onSocketClose.bind(this));
  transport.on('error', this._onSocketError.bind(this));
}

util.inherits(Connection, events.EventEmitter);

// Send a call packet over the connection
//   interfaceName - name of an interface
//   methodName - name of a method
//   args - method arguments
//   callback - callback function that is invoked after a callback packet
//              has been received
//
Connection.prototype.callMethod = function(
  interfaceName, methodName, args, callback
) {
  var packet = this.createPacket('call', interfaceName, methodName, args);
  var packetId = packet.call[0];
  this._callbacks[packetId] = callback || common.doNothing;
  this._send(packet);
};

// Send a callback packet over the connection
//   packetId - id of a call packet to send callback packet for
//   error - error that has occured or null
//   result - result of a remote method if there was no error
//
Connection.prototype.callback = function(packetId, error, result) {
  var packet;

  if (error) {
    error = errors.RemoteError.getJstpArrayFor(error);
    packet = this.createPacket('callback', null, 'error', error);
  } else {
    packet = this.createPacket('callback', null, 'ok', result);
  }

  packet.callback[0] = packetId;

  this._send(packet);
};

// Send an event packet over the connection
//   interfaceName - name of an interface
//   eventName - name of an event
//   args - event arguments as an object
//
Connection.prototype.emitRemoteEvent = function(
  interfaceName, eventName, args
) {
  var packet = this.createPacket('event', interfaceName, eventName, args);
  this._send(packet);
};

// Send a state synchronization packet over the connection
//   path - path to a value in the application state
//   verb - operation with this value (inc, dec, let, delete, push, pop, shift,
//          unshift)
//   value - a value to modify the current value with
//
Connection.prototype.notifyStateChange = function(path, verb, value) {
  var packet = this.createPacket('state', path, verb, value);
  this._send(packet);
};

// Send a handshake packet over the connection
//   appName - name of an application to connect to
//   login - user name (optional)
//   password - user password (optional)
//   callback - callback function to invoke after the handshake is completed
//
Connection.prototype.handshake = function(appName, login, password, callback) {
  var packet = this.createPacket('handshake', appName, login, password);
  var packetId = packet.handshake[0];
  var self = this;

  this._callbacks[packetId] = function(error, sessionId) {
    if (login && password && !error) {
      self.username = login;
    }
    self.sessionId = sessionId;
    if (callback) {
      callback(error, sessionId);
    }
  };

  this._send(packet);
};

// Send an inspect packet over the connection
//   interfaceName - name of an interface to inspect
//   callback - callback function to invoke after another side responds
//              with interface introspection
//
Connection.prototype.inspectInterface = function(interfaceName, callback) {
  var packet = this.createPacket('inspect', interfaceName, null, null);
  var packetId = packet.inspect[0];
  var self = this;

  this._callbacks[packetId] = function(error) {
    if (error) {
      return callback(error);
    }

    var methods = Array.prototype.slice.call(arguments, 1);
    var proxy = new RemoteProxy(this, interfaceName, methods);

    self.remoteProxies[interfaceName] = proxy;

    if (callback) {
      callback(null, proxy);
    }
  };

  this._send(packet);
};

// Send a ping packet
//
Connection.prototype.ping = function(callback) {
  var packet = this.createPacket('ping');
  var packetId = packet.ping[0];
  this._callbacks[packetId] = callback || common.doNothing;
  this._send(packet);
};

// Send a pong packet
//
Connection.prototype.pong = function(packetId) {
  var packet = { pong: [packetId] };
  this._send(packet);
};

// Start sending heartbeat packets
//   interval - heartbeat interval in milliseconds
//
Connection.prototype.startHeartbeat = function(interval) {
  this._heartbeatCallbackInstance =
    this._heartbeatCallback.bind(this, interval);
  this._heartbeatCallbackInstance();
};

// Internal function used by startHeartbeat
//
Connection.prototype._heartbeatCallback = function(interval) {
  this.transport.send('{}');
  this.setTimeout(interval, this._heartbeatCallbackInstance);
};

// Stop sending heartbeat packets
//
Connection.prototype.stopHeartbeat = function() {
  if (this._heartbeatCallbackInstance) {
    this.clearTimeout(this._heartbeatCallbackInstance);
    this._heartbeatCallbackInstance = null;
  }
};

// Create a JSTP packet
//   kind - packet kind
//   target - name of an interface or an application (optional)
//   verb - action specific for different packet kinds
//   args - action arguments
//
Connection.prototype.createPacket = function(kind, target, verb, args) {
  var packet = {};

  packet[kind] = (
    target ?
    [this._nextPacketId, target] :
    [this._nextPacketId]
  );

  if (verb) {
    packet[verb] = args;
  }

  this._nextPacketId += this._packetIdDelta;

  return packet;
};

// Close the connection
//
Connection.prototype.close = function() {
  this.stopHeartbeat();
  this.transport.end();
};

// Set a timeout using timers.enroll()
//   milliseconds - amount of milliseconds
//   callback - callback function
//
Connection.prototype.setTimeout = function(milliseconds, callback) {
  timers.enroll(this, milliseconds);
  timers._unrefActive(this);
  this.once('_timeout', callback);
};

// Clear a timeout set with Connection#setTimeout
//   handler - timer callback to remove
//
Connection.prototype.clearTimeout = function(handler) {
  timers.unenroll(this);
  this.removeListener('_timeout', handler);
};

// timers.enroll() timeout handler
//
Connection.prototype._onTimeout = function() {
  this.emit('_timeout');
};

// Send a JSTP packet over this connection
//   packet - a packet to send
//
Connection.prototype._send = function(packet) {
  var data = jsrs.stringify(packet);
  this.transport.send(data);
};

// Close the connection, optionally sending a final packet
//   packet - a packet to send (optional)
//
Connection.prototype._end = function(packet) {
  this.stopHeartbeat();

  if (packet) {
    var data = jsrs.stringify(packet);
    this.transport.end(data);
  } else {
    this.transport.end();
  }
};

// Closed socket event handler
//
Connection.prototype._onSocketClose = function() {
  this.stopHeartbeat();
  this.emit('close', this);
  if (this.server) {
    this.server.emit('disconnect', this);
  }
};

// Socket error event handler
//   error - error that has occured
//
Connection.prototype._onSocketError = function(error) {
  this.emit('error', error, this);
};

// Process parsed incoming packets
//   packets - array of packets
//
Connection.prototype._processPacket = function(packet) {
  var keys = Object.keys(packet);
  if (keys.length === 0) {
    return;  // heartbeat packet
  }

  var kind = keys[0];
  if (!this.handshakeDone && kind !== 'handshake') {
    this._rejectPacket(packet, true);
    return;
  }

  var handler = Connection.PACKET_HANDLERS[kind];
  if (handler) {
    handler.call(this, packet, keys);
  } else {
    this._rejectPacket(packet);
  }
};

// Reject incoming packet
//   packet - rejected packet
//   fatal - if true, close the connection
//
Connection.prototype._rejectPacket = function(packet, fatal) {
  this.emit('packetRejected', packet, this);

  if (fatal) {
    this._end();
  }
};

// Process incoming handshake packet
//   packet - parsed packet
//   keys - array of packet keys
//
Connection.prototype._processHandshakePacket = function(packet, keys) {
  if (this.handshakeDone) {
    this.emit('abundantHandshake', packet, this);
    return;
  }

  if (packet.handshake[1]) {  // if there is an application name
    this._processHandshakeRequest(packet, keys);
  } else {
    this._processHandshakeResponse(packet, keys);
  }
};

// Process incoming handshake packet which is a handshake request
//   packet - parsed packet
//   keys - array of packet keys
//
Connection.prototype._processHandshakeRequest = function(packet, keys) {
  if (!this.server) {
    this._handshakeError(errors.ERR_NOT_A_SERVER);
    return;
  }

  var applicationName = packet.handshake[1];
  var application = this.server.applications[applicationName];

  if (!application) {
    this._handshakeError(errors.ERR_APP_NOT_FOUND);
    return;
  }

  this.application = application;

  var username = keys[1];
  var password = packet[username];

  this._emitPacketEvent('handshakeRequest', packet, packet.handshake[0], {
    packetType: 'handshake',
    handshakeRequest: true,
    username: username,
    password: password
  });

  var callback = this._onSessionCreated.bind(this, username);
  this.server.startSession(this, application, username, password, callback);
};

// Callback of authentication operation
//   username - user login, if any
//   error - error that has occured or null
//   sessionId - session id or hash
//
Connection.prototype._onSessionCreated =
  function(username, error, sessionId) {
    if (error) {
      this._handshakeError(errors.ERR_AUTH_FAILED);
      return;
    }

    if (username) {
      this.username = username;
    }

    this.handshakeDone = true;
    this.sessionId = sessionId;

    this.emit('client', sessionId, this);
    this.server.emit('connect', this);

    var packet = this.createPacket('handshake', null, 'ok', sessionId);
    this._send(packet);
  };

// Process incoming handshake packet which is a handshake response
//   packet - parsed packet
//
Connection.prototype._processHandshakeResponse = function(packet) {
  var packetId = packet.handshake[0];
  var callback = this._callbacks[packetId];

  if (!callback) {
    this._rejectPacket(packet);
  }

  if (packet.ok) {
    delete this._callbacks[packetId];

    this.handshakeDone = true;
    this.application = this.client.application;
    this._emitPacketEvent('handshake', packet, packetId, {
      sessionId: packet.ok
    });

    callback(null, packet.ok);
  } else if (packet.error) {
    delete this._callbacks[packetId];
    callback(errors.RemoteError.fromJstpArray(packet.error));
  } else {
    this._rejectPacket(packet, true);
  }
};

// End the connection with handshake error
//   error - error that has occured
//
Connection.prototype._handshakeError = function(error) {
  var normalizedError = errors.RemoteError.getJstpArrayFor(error);
  var packet = this.createPacket('handshake', null, 'error', normalizedError);

  this._end(packet);
};

// Process incoming call packet
//   packet - parsed packet
//   keys - array of packet keys
//
Connection.prototype._processCallPacket = function(packet, keys) {
  var packetId = packet.call[0];
  var interfaceName = packet.call[1];
  var methodName = keys[1];
  var args = packet[methodName];

  this._emitPacketEvent('call', packet, packetId, {
    interfaceName: interfaceName,
    methodName: methodName
  });

  var callback = this._remoteCallbackWrapper.bind(this, packetId);

  try {
    this.application.callMethod(this,
      interfaceName, methodName, args, callback);
  } catch (error) {
    callback(errors.ERR_INTERNAL_API_ERROR);
    throw error;
  }
};

// Process incoming callback packet
//   packet - parsed packet
//
Connection.prototype._processCallbackPacket = function(packet) {
  var packetId = packet.callback[0];
  var callback = this._callbacks[packetId];

  if (callback) {
    delete this._callbacks[packetId];

    if (packet.ok) {
      callback.apply(this, [null].concat(packet.ok));
    } else if (packet.error) {
      callback(errors.RemoteError.fromJstpArray(packet.error));
    } else {
      this._rejectPacket(packet);
    }
  }

  var eventArgs = callback ? null : { sourcePacketUnknown: true };

  this._emitPacketEvent('callback', packet, packetId, eventArgs);

  if (!callback) {
    this.emit('callbackForUnknownPacket', packetId, packet, this);
  }
};

// Process incoming event packet
//   packet - parsed packet
//   keys - array of packet keys
//
Connection.prototype._processEventPacket = function(packet, keys) {
  var interfaceName = packet.event[1];
  var eventName = keys[1];
  var eventArgs = packet[eventName];

  this._emitPacketEvent('event', packet, packet.event[0], {
    interfaceName: interfaceName,
    remoteEventName: eventName,
    remoteEventArgs: eventArgs
  });

  var remoteProxy = this.remoteProxies[interfaceName];
  if (remoteProxy) {
    remoteProxy.emit(eventName, eventArgs, true);
  }
};

// Process incoming inspect packet
//   packet - parsed packet
//
Connection.prototype._processInspectPacket = function(packet) {
  var packetId = packet.inspect[0];
  var interfaceName = packet.inspect[1];

  this._emitPacketEvent('inspect', packet, packetId, {
    interfaceName: interfaceName
  });

  var methods = this.application.getMethods(interfaceName);
  if (methods) {
    this.callback(packetId, null, methods);
  } else {
    this.callback(packetId, errors.ERR_INTERFACE_NOT_FOUND);
  }
};

// Process incoming state packet
//   packet - parsed packet
//
Connection.prototype._processStatePacket = function(packet, keys) {
  var path = packet.state[1];
  var verb = keys[1];
  var value = packet[verb];

  this._emitPacketEvent('state', packet, packet.state[0], {
    path: path,
    verb: verb,
    value: value
  });
};

// Process incoming ping packet
//   packet - parsed packet
//
Connection.prototype._processPingPacket = function(packet) {
  this.pong(packet.ping[0]);
};

// Process incoming pong packet
//   packet - parsed packet
//
Connection.prototype._processPongPacket = function(packet) {
  var packetId = packet.pong[0];
  var callback = this._callbacks[packetId];
  if (callback) {
    delete this._callbacks[packetId];
    callback();
  }
};

// Callback of functions invoked via call packets
// Signature: Connection#_remoteCallbackWrapper(packetId, error, ...result)
//   packetId - id of a packet to send callback for
//   error - error that has occured, if any
//   result - data to send back as a result
//
Connection.prototype._remoteCallbackWrapper = function(packetId, error) {
  var result = Array.prototype.slice.call(arguments, 2);
  this.callback(packetId, error, result);
};

// Emit an event notifying about incoming packet. The event payload is an
// object that contains information about the connection, application, packet,
// packet type, packet ID and any additional data that you pass to this
// function.
//   kind - packet type and event name
//   packet - parsed packet
//   packetId - packet ID
//   args - additional event arguments (optional)
//
Connection.prototype._emitPacketEvent = function(kind, packet, packetId, args) {
  var eventArgs = {
    connection: this,
    packetType: kind,
    packet: packet,
    packetId: packetId,
    application: this.application
  };

  if (args) {
    common.extend(eventArgs, args);
  }

  this.emit(kind, eventArgs);
};

// Mapping of packet types to handler function names
//
Connection.PACKET_HANDLERS = {
  handshake: Connection.prototype._processHandshakePacket,
  call:      Connection.prototype._processCallPacket,
  callback:  Connection.prototype._processCallbackPacket,
  event:     Connection.prototype._processEventPacket,
  inspect:   Connection.prototype._processInspectPacket,
  state:     Connection.prototype._processStatePacket,
  ping:      Connection.prototype._processPingPacket,
  pong:      Connection.prototype._processPongPacket
};
