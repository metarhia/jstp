'use strict';

const events = require('events');
const inherits = require('util').inherits;

const jstp = require('../..');
const utils = require('./utils');

const DEFAULT_SCHEME = 'jstps';

module.exports = Cli;

const commandProcessor = {};
const lineProcessor = {};

// log - logger function to print results
//       help and error messages
//
function Cli(log) {
  events.EventEmitter.call(this);

  this.log = log;

  this.client = null;
  this.connection = null;
  this.api = {};

  this.commandProcessor = {};
  this.lineProcessor = {};

  utils.bindAll(this, commandProcessor, this.commandProcessor);
  utils.bindAll(this, lineProcessor, this.lineProcessor);
}

inherits(Cli, events.EventEmitter);

Cli.prototype.completer = function(line) {
  const inputs = utils.split(line, ' ', 0, true);
  const [completions, help] =
    utils.iterativeCompletion(inputs, 0, this.commandProcessor);
  if (help) this.log('\n' + help);
  // to allow partial completion, as method above gives
  // completions for the latest command part
  const lastPart = inputs.length === 0 ? line : inputs[inputs.length - 1];
  return [completions, lastPart];
};

Cli.prototype._logErr = function(err) {
  this.log(`${err.name} occurred: ${err.message}`);
};

Cli.prototype.processLine = function(line, callback) {
  const [type, leftover] = utils.split(line.trim(), ' ', 1);
  if (!type) {
    return callback(null);
  }

  const cmd = utils.tryCompleter(type, this.commandProcessor);

  const processor = this.lineProcessor[cmd];
  if (!processor) {
    this.log(`Unknown command '${cmd}'`);
  } else {
    processor(leftover, (err, result) => {
      if (err) return this._logErr(err);
      this.log(result);
    });
  }
  callback(null);
};

commandProcessor.complete = function(inputs, depth) {
  const completions = ['call', 'connect', 'disconnect', 'event', 'exit'];
  const cmd = inputs[depth];
  return [utils.complete(cmd, completions), depth + 1];
};

commandProcessor.call = function(interfaceName, methodName, args, callback) {
  if (!this.client) return callback(new Error('Not connected'));
  this.connection.callMethod(interfaceName, methodName, args, callback);
};

commandProcessor.call.complete = function(inputs, depth) {
  if (!this.api) return [[], depth];

  const iface = inputs[depth++];
  let method = inputs[depth];
  // there may be multiple spaces between interface and method names
  // this function completes both of them so handle empty element ('')
  // in between (just skip it)
  if (method === '' && inputs[depth + 1] !== undefined) {
    method = inputs[++depth];
  }

  let completions = utils.complete(iface, Object.keys(this.api));
  if (method === undefined || !completions.some(el => el === iface)) {
    return [completions, depth];
  }

  completions = utils.complete(method, this.api[iface]);
  if (completions.length === 1 && method === completions[0]) {
    // full method name -> show help
    return [[], depth + 1];
  }
  return [completions, depth + 1];
};

commandProcessor.call.help = () => (
  'call <interfaceName> <methodName> [ <arg> [ , ... ] ]'
);

commandProcessor.event = function(interfaceName, eventName, args, callback) {
  if (!this.client) return callback(new Error('Not connected'));
  this.connection.emitRemoteEvent(interfaceName, eventName, args);
  callback();
};

commandProcessor.event.help = () => (
  'event <interfaceName> <eventName> [ <arg> [ , ... ] ]'
);

commandProcessor.connect = function(
  protocol, host, port, appName, interfaces, callback
) {
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

  this.client = transport.createClient(url);
  this.client.connectAndInspect(appName, null, null, interfaces,
      (err, connection, api) => {
        if (err) return callback(err);
        this.connection = connection;
        this.api = utils.filterFields(api, ['_', 'domain']);
        // TODO: make event registering generic
        connection.on('event', (event) => {
          this.log(`Received remote event '${event.remoteEventName}'` +
            ` in interface '${event.interfaceName}':` +
            ` ${jstp.stringify(event.remoteEventArgs)}`);
        });
        connection.on('error', err => this._logErr(err));
        callback();
      }
  );
};

commandProcessor.connect.help = () => (
  'connect [<protocol>://]<host>:<port> <application name> ' +
  '[ <interface> [ ... ] ]'
);

commandProcessor.disconnect = function(callback) {
  if (this.client) {
    return this.client.disconnect(() => {
      this.connection = null;
      this.client = null;
      callback();
    });
  }
  callback(new Error('Not connected'));
};

commandProcessor.exit = function() {
  this.emit('exit');
};

const reportMissingArgument =
  missing => new Error(`${missing} is not provided`);

lineProcessor.call = function(tokens, callback) {
  if (tokens === undefined) {
    return callback(reportMissingArgument('Interface name'));
  }
  const args = utils.split(tokens, ' ', 2);
  if (args.length === 1) {
    return callback(reportMissingArgument('Method name'));
  }
  let methodArgs;
  try {
    methodArgs = jstp.parse('[' + args[2] + ']');
  } catch (err) {
    return callback(err);
  }
  this.commandProcessor.call(args[0], args[1], methodArgs, (err, ...result) => {
    if (err) return callback(err);
    callback(null, `Method ${args[0]}.${args[1]} returned: ` +
                   jstp.stringify(result));
  });
};

lineProcessor.event = function(tokens, callback) {
  if (tokens === undefined) {
    return callback(reportMissingArgument('Interface name'));
  }
  const args = utils.split(tokens, ' ', 2);
  if (args.length === 1) {
    return callback(reportMissingArgument('Event name'));
  }
  let eventArgs;
  try {
    eventArgs = jstp.parse('[' + args[2] + ']');
  } catch (err) {
    return callback(err);
  }
  this.commandProcessor.event(args[0], args[1], eventArgs, (err) => {
    if (err) return callback(err);
    callback(null, `Event ${args[0]}.${args[1]} successfully emitted`);
  });
};

lineProcessor.connect = function(tokens, callback) {
  if (tokens === undefined) {
    return callback(reportMissingArgument('Host'));
  }
  const args = utils.split(tokens, ' ', 2);
  let [scheme, authority] = utils.split(args[0], '://', 1, true);
  if (authority === undefined) {
    authority = scheme;
    scheme = DEFAULT_SCHEME;
  }
  const [host, portString] = utils.split(authority, ':', 2, true);
  if (!host) {
    return callback(reportMissingArgument('Host'));
  } else if (!portString) {
    return callback(reportMissingArgument('Port'));
  }
  const port = Number(portString);
  if (isNaN(port) || port < 0 || port >= 65536) {
    return callback(new Error(`Port has incorrect value: ${portString}`));
  }
  const appName = args[1];
  if (appName === undefined) {
    return callback(reportMissingArgument('Application name'));
  }
  const interfaces = args[2] ? utils.split(args[2], ' ') : [];
  this.commandProcessor.connect(scheme, host, port, appName, interfaces,
    (err) => {
      if (err) return callback(err);
      callback(null, 'Connection established');
    });
};

lineProcessor.disconnect = function(_, callback) {
  this.commandProcessor.disconnect((err) => {
    if (err) return callback(err);
    callback(null, 'Successful disconnect');
  });
};

// Map all remaining commands directly
Object.keys(commandProcessor).map((command) => {
  if (!lineProcessor[command]) {
    lineProcessor[command] = commandProcessor[command];
  }
});

