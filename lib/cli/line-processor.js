'use strict';

const jstp = require('../..');
const utils = require('./utils');

const DEFAULT_SCHEME = 'jstps';

const reportMissingArgument =
  missing => new Error(`${missing} is not provided`);

module.exports = class LineProcessor {
  constructor(commandProcessor) {
    this.commandProcessor = commandProcessor;
  }

  call(tokens, callback) {
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
    this.commandProcessor.call(args[0], args[1], methodArgs,
      (err, ...result) => {
        if (err) return callback(err);
        const iface = args[0];
        const method = args[1];
        const res = jstp.stringify(result);
        const msg = `Method ${iface}.${method} returned: ${res}`;
        callback(null, msg);
      });
  }

  event(tokens, callback) {
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
  }

  connect(tokens, callback) {
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
    this.commandProcessor.connect(
      scheme, host, port, appName, interfaces,
      (err) => {
        if (err) return callback(err);
        callback(null, 'Connection established');
      }
    );
  }

  disconnect(_, callback) {
    this.commandProcessor.disconnect((err) => {
      if (err) return callback(err);
      callback(null, 'Successful disconnect');
    });
  }
};
