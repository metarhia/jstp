'use strict';

const events = require('events');
const util = require('util');

module.exports = RemoteProxy;

// Remote API proxy object class. It wraps remote methods so that they look
// like regular local methods and acts like a remote event emitter.
//   connection - JSTP connection to use
//   interfaceName - name of an interface that is proxied
//   methods - array of method names (optional)
//
function RemoteProxy(connection, interfaceName, methods = []) {
  events.EventEmitter.call(this);

  this._connection = connection;
  this._interfaceName = interfaceName;

  for (let i = 0; i < methods.length; i++) {
    RemoteProxy.wrapRemoteMethod(this, methods[i]);
  }
}

util.inherits(RemoteProxy, events.EventEmitter);

// Emit an event.
//   eventName - name of an event
//   eventArgs - event arguments
//
RemoteProxy.prototype.emit = function(eventName, ...eventArgs) {
  this._connection.emitRemoteEvent(this._interfaceName, eventName, eventArgs);
  this._emitLocal(eventName, eventArgs);
};

// Emit local event.
//   eventName - name of an event
//   eventArgs - array of event arguments
//
RemoteProxy.prototype._emitLocal = function(eventName, eventArgs) {
  if (!eventArgs) eventArgs = [];
  events.EventEmitter.prototype.emit.call(this, eventName, ...eventArgs);
};

// Create a method in a remote proxy that will call the corresponding remote
// method. This is implemented as a static method rather than an instance
// method so that it will not be rewritten by a remote API method with the same
// name.
//   instance - remote proxy object
//   method - name of a method
//
RemoteProxy.wrapRemoteMethod = (instance, methodName) => {
  instance[methodName] = remoteMethodWrapper.bind(instance, methodName);
};

// Remote method wrapper
//   this - remote proxy instance
//   methodName - name of a remote method
//
function remoteMethodWrapper(methodName, ...args) {
  let callback = args[args.length - 1];
  args = Array.prototype.slice.call(args, 0, -1);

  if (typeof(callback) !== 'function') {
    args.push(callback);
    callback = null;
  }

  this._connection.callMethod(this._interfaceName, methodName, args, callback);
}
