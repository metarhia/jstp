'use strict';

const EventEmitter = require('events').EventEmitter;

const mdsf = require('mdsf');

const jstp = require('../..');
const utils = require('./utils');

class CallCompleter {
  constructor(cli) {
    this.cli = cli;
  }

  complete(inputs, depth) {
    if (!this.cli.api) return [[], depth];

    const iface = inputs[depth++];
    let method = inputs[depth];
    // there may be multiple spaces between interface and method names
    // this function completes both of them so handle empty element ('')
    // in between (just skip it)
    if (method === '' && inputs[depth + 1] !== undefined) {
      method = inputs[++depth];
    }

    let completions = utils.complete(iface, Object.keys(this.cli.api));
    if (method === undefined || !completions.some(el => el === iface)) {
      return [completions, depth];
    }

    completions = utils.complete(method, this.cli.api[iface]);
    if (completions.length === 1 && method === completions[0]) {
      // full method name -> show help
      return [[], depth + 1];
    }
    return [completions, depth + 1];
  }

  getNextCompleter() {}

  help() {
    return 'call <interfaceName> <methodName> [ <arg> [ , ... ] ]';
  }
}

class EventCompleter {
  help() {
    return 'event <interfaceName> <eventName> [ <arg> [ , ... ] ]';
  }
}

class ConnectCompleter {
  help() {
    return 'connect [<protocol>://]<host>:<port> <application name> ' +
      '[ <interface> [ ... ] ]';
  }
}

function filterApiCompletions(rawApi) {
  const api = {};
  const forbidden = ['_', 'domain'];
  Object.keys(rawApi).forEach(int => {
    api[int] = Object.keys(rawApi[int])
      .filter(c => forbidden.every(el => !c.startsWith(el)));
  });
  return api;
}

module.exports = class CommandProcessor extends EventEmitter {
  constructor(cli) {
    super();
    this.cli = cli;

    this.completers = {
      call: new CallCompleter(cli),
      event: new EventCompleter(cli),
      connect: new ConnectCompleter(cli),
    };

    this._connectionCloseListener = () => {
      this.cli.log('Connection lost');
    };
  }

  getNextCompleter(name) {
    return this.completers[name];
  }

  complete(inputs, depth) {
    const completions = ['call', 'connect', 'disconnect', 'event', 'exit'];
    const cmd = inputs[depth];
    return [utils.complete(cmd, completions), depth + 1];
  }

  call(interfaceName, methodName, args, callback) {
    if (!this.cli.connection) {
      callback(new Error('Not connected'));
      return;
    }
    this.cli.connection.callMethod(interfaceName, methodName, args, callback);
  }

  event(interfaceName, eventName, args, callback) {
    if (!this.cli.connection) {
      callback(new Error('Not connected'));
      return;
    }
    this.cli.connection.emitRemoteEvent(interfaceName, eventName, args);
    callback();
  }

  connect(protocol, host, port, app, interfaces, callback) {
    if (this.cli.connection) {
      this._disconnect();
    }

    let transport;
    let args;

    switch (protocol) {
      case 'jstp':
        transport = jstp.net;
        args = [port, host];
        break;
      case 'jstps':
        transport = jstp.tls;
        args = [port, host];
        break;
      case 'ws':
      case 'wss':
        transport = jstp[protocol];
        args = [null, `${protocol}://${host}:${port}`];
        break;
      case 'ipc':
        transport = jstp.net;
        args = [host];
        break;
      default:
        callback(new Error(`Unknown protocol '${protocol}'`));
        return;
    }
    transport.connectAndInspect(app, this.cli.client, interfaces, ...args,
      (err, connection, api) => {
        this.cli.connection = connection;
        if (err) {
          callback(err);
          return;
        }
        this.cli.api = filterApiCompletions(api, ['_', 'domain']);

        connection.once('close', this._connectionCloseListener);
        connection.on('reconnectAttempt', () => {
          this.cli.log('Attempting to reconnect...');
        });
        connection.on('reconnect', err => {
          if (err) {
            this.cli.log('Reconnection failed');
            this.cli._logErr(err);
          } else {
            this.cli.log('Successfully reconnected');
            connection.once('close', this._connectionCloseListener);
          }
        });
        // TODO: make event registering generic
        connection.on('event', (interfaceName, eventName, args) => {
          this.cli.log(`Received remote event '${eventName}'` +
            ` in interface '${interfaceName}':\n${mdsf.stringify(
              args, null, this.cli.indent
            )}`);
        });
        connection.on('error', err => {
          this.cli._logErr(err);
        });
        callback();
      }
    );
  }

  disconnect(callback) {
    if (!this.cli.connection) {
      callback(new Error('Not connected'));
      return;
    }
    this._disconnect();
    callback();
  }

  exit() {
    this.emit('exit');
  }

  _disconnect() {
    this.cli.connection.removeListener('close', this._connectionCloseListener);
    this.cli.connection.close();
    this.cli.connection = null;
  }
};
