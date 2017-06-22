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
      callback(reportMissingArgument('Interface name'));
      return;
    }
    const args = utils.split(tokens, ' ', 2);
    if (args.length === 1) {
      callback(reportMissingArgument('Method name'));
      return;
    }
    let methodArgs;
    try {
      methodArgs = jstp.parse('[' + args[2] + ']');
    } catch (err) {
      callback(err);
      return;
    }
    this.commandProcessor.call(args[0], args[1], methodArgs,
      (err, ...result) => {
        if (err) {
          callback(err);
          return;
        }
        const iface = args[0];
        const method = args[1];
        const res = jstp.stringify(result);
        const msg = `Method ${iface}.${method} returned: ${res}`;
        callback(null, msg);
      });
  }

  event(tokens, callback) {
    if (tokens === undefined) {
      callback(reportMissingArgument('Interface name'));
      return;
    }
    const args = utils.split(tokens, ' ', 2);
    if (args.length === 1) {
      callback(reportMissingArgument('Event name'));
      return;
    }
    let eventArgs;
    try {
      eventArgs = jstp.parse('[' + args[2] + ']');
    } catch (err) {
      callback(err);
      return;
    }
    this.commandProcessor.event(args[0], args[1], eventArgs, (err) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, `Event ${args[0]}.${args[1]} successfully emitted`);
    });
  }

  connect(tokens, callback) {
    if (tokens === undefined) {
      callback(reportMissingArgument('Host'));
      return;
    }
    const args = utils.split(tokens, ' ', 2);
    let [scheme, authority] = utils.split(args[0], '://', 1, true);
    if (authority === undefined) {
      authority = scheme;
      scheme = DEFAULT_SCHEME;
    }
    const [host, portString] = utils.split(authority, ':', 2, true);
    let port;
    if (!host) {
      callback(reportMissingArgument('Host'));
      return;
    }
    if (scheme !== 'ipc') {
      if (!portString) {
        callback(reportMissingArgument('Port'));
        return;
      }
      port = Number(portString);
      if (isNaN(port) || port < 0 || port >= 65536) {
        callback(new Error(`Port has incorrect value: ${portString}`));
        return;
      }
    }
    const app = args[1];
    if (app === undefined) {
      callback(reportMissingArgument('Application name'));
      return;
    }
    const interfaces = args[2] ? utils.split(args[2], ' ') : [];
    this.commandProcessor.connect(
      scheme, host, port, app, interfaces,
      (err) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, 'Connection established');
      }
    );
  }

  disconnect(_, callback) {
    this.commandProcessor.disconnect((err) => {
      if (err) {
        callback(err);
        return;
      }
      callback(null, 'Successful disconnect');
    });
  }
};
