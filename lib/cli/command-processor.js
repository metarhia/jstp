'use strict';

const EventEmitter = require('events').EventEmitter;

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
  Object.keys(rawApi).forEach((int) => {
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
      connect: new ConnectCompleter(cli)
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
    if (!this.cli.client) return callback(new Error('Not connected'));
    this.cli.connection.callMethod(interfaceName, methodName, args, callback);
  }

  event(interfaceName, eventName, args, callback) {
    if (!this.cli.client) return callback(new Error('Not connected'));
    this.cli.connection.emitRemoteEvent(interfaceName, eventName, args);
    callback();
  }

  connect(protocol, host, port, appName, interfaces, callback) {
    let transport;

    switch (protocol) {
      case 'jstp':
      case 'jstps':
        transport = jstp.tcp;
        break;
      case 'ws':
      case 'wss':
        transport = jstp.ws;
        break;
      default:
        return callback(new Error(`Unknown protocol '${protocol}'`));
    }

    const url = `${protocol}://${host}:${port}`;

    this.cli.client = transport.createClient(url);
    this.cli.client.connectAndInspect(appName, null, null, interfaces,
      (err, connection, api) => {
        if (err) return callback(err);
        this.cli.connection = connection;
        this.cli.api = filterApiCompletions(api, ['_', 'domain']);
        // TODO: make event registering generic
        connection.on('event', (event) => {
          this.cli.log(`Received remote event '${event.remoteEventName}'` +
            ` in interface '${event.interfaceName}':` +
            ` ${jstp.stringify(event.remoteEventArgs)}`);
        });
        connection.on('error', err => this.cli._logErr(err));
        callback();
      }
    );
  }

  disconnect(callback) {
    if (this.cli.client) {
      return this.cli.client.disconnect(() => {
        this.cli.connection = null;
        this.cli.client = null;
        callback();
      });
    }
    callback(new Error('Not connected'));
  }

  exit() {
    this.emit('exit');
  }
};
