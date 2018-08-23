'use strict';

const EventEmitter = require('events').EventEmitter;
const mdsf = require('mdsf');

const CommandProcessor = require('./command-processor');
const LineProcessor  = require('./line-processor');
const utils = require('./utils');

const VERBOSENESS_LEVEL = {
  QUIET: 0,
  NO_HEARTBEAT: 1,
  ALL: 2,
};

module.exports = class Cli extends EventEmitter {
  // log - logger function to print results,
  //       help and error messages
  constructor(log, options) {
    super();

    this.log = log;

    this.client = {
      heartbeatInterval: options.heartbeatInterval,
    };

    if (options.verbose) {
      this.client.logger = new EventEmitter();

      this.client.logger.on('outgoingMessage', message => {
        if (
          (!message.pong && !message.ping) ||
          options.verbose === VERBOSENESS_LEVEL.ALL
        ) {
          this.log(`Outgoing message:\n${mdsf.stringify(message)}`);
        }
      });

      this.client.logger.on('incomingMessage', message => {
        if (
          (!message.pong && !message.ping) ||
          options.verbose === VERBOSENESS_LEVEL.ALL
        ) {
          this.log(`Incoming message:\n${mdsf.stringify(message)}`);
        }
      });
    }

    if (options.noReconnect) {
      this.client.reconnector = () => {};
    }

    this.connection = null;
    this.api = {};

    this.commandProcessor = new CommandProcessor(this);
    this.commandProcessor.on('exit', () => {
      this.emit('exit');
    });

    this.lineProcessor = new LineProcessor(this.commandProcessor);

    // Map all remaining commands directly
    utils.filterKeys(
      Object.getOwnPropertyNames(CommandProcessor.prototype),
      ['constructor', 'complete', 'getNextCompleter']
    ).map(command => {
      if (!this.lineProcessor[command]) {
        this.lineProcessor[command] =
          (...args) => this.commandProcessor[command](...args);
      }
    });
  }

  completer(line) {
    const inputs = utils.split(line, ' ', 0, true);
    const [completions, help] =
      utils.iterativeCompletion(inputs, 0, this.commandProcessor);
    if (help) this.log('\n' + help);
    // to allow partial completion, as method above gives
    // completions for the latest command part
    const lastPart = inputs.length === 0 ? line : inputs[inputs.length - 1];
    return [completions, lastPart];
  }

  _logErr(err) {
    this.log(`${err.name} occurred: ${err.message}`);
  }

  processLine(line, callback) {
    const [type, leftover] = utils.split(line.trim(), ' ', 1);
    if (!type) {
      callback(null);
      return;
    }

    const cmd = utils.tryCompleter(type, this.commandProcessor);

    const processor = this.lineProcessor[cmd];
    if (!processor) {
      this.log(`Unknown command '${cmd}'`);
    } else {
      processor.call(this.lineProcessor, leftover, (err, result) => {
        if (err) {
          this._logErr(err);
          return;
        }
        this.log(result);
      });
    }
    callback(null);
  }
};
