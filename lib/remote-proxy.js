'use strict';

const { EventEmitter } = require('events');

// Remote API proxy object class. It wraps remote methods so that they look
// like regular local methods and acts like a remote event emitter.
//
class RemoteProxy extends EventEmitter {
  //   connection - JSTP connection to use
  //   interfaceName - name of an interface that is proxied
  //   methods - array of method names (optional)
  //
  constructor(connection, interfaceName, methods = []) {
    super();

    this._connection = connection;
    this._interfaceName = interfaceName;

    methods.filter(method => this[method] === undefined)
      .forEach(method => {
        this[method] = (...args) => {
          let resend = args[args.length - 1];
          let callback = args[args.length - 2];

          if (typeof callback === 'function' && typeof resend === 'boolean') {
            args = args.slice(0, -2);
          } else if (typeof resend === 'function') {
            callback = resend;
            resend = false;
            args = args.slice(0, -1);
          } else {
            callback = null;
            resend = false;
          }

          (resend ?
            this._connection.callMethodWithResend :
            this._connection.callMethod
          ).call(this._connection, this._interfaceName, method, args, callback);
        };
      });
  }

  // Emit an event.
  //   eventName - name of an event
  //   eventArgs - event arguments
  //
  emit(eventName, ...eventArgs) {
    this._connection.emitRemoteEvent(this._interfaceName, eventName, eventArgs);
    this._emitLocal(eventName, eventArgs);
  }

  // Emit local event.
  //   eventName - name of an event
  //   eventArgs - array of event arguments
  //
  _emitLocal(eventName, eventArgs = []) {
    super.emit(eventName, ...eventArgs);
  }
}

module.exports = RemoteProxy;
