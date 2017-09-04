'use strict';

const EventEmitter = require('events').EventEmitter;

const CommandProcessor = require('./command-processor');
const LineProcessor  = require('./line-processor');
const autocomplete = require('./autocomplete');

module.exports = class Cli extends EventEmitter {
  // log - logger function to print results,
  //       help and error messages
  constructor(log) {
    super();

    this.log = log;

    this.client = null;
    this.connection = null;
    this.api = {};

    this.commandProcessor = new CommandProcessor(this);
    this.commandProcessor.on('exit', () => {
      this.emit('exit');
    });

    this.lineProcessor = new LineProcessor(this.commandProcessor);

    // Map all remaining commands directly
    autocomplete.filterKeys(
      Object.getOwnPropertyNames(CommandProcessor.prototype),
      ['constructor', 'complete', 'getNextCompleter']
    ).map((command) => {
      if (!this.lineProcessor[command]) {
        this.lineProcessor[command] =
          (...args) => this.commandProcessor[command](...args);
      }
    });
  }

  completer(line) {
    const inputs = autocomplete.split(line, ' ', 0, true);
    const [completions, help] =
      autocomplete.iterativeCompletion(inputs, 0, this.commandProcessor);
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
    const [type, leftover] = autocomplete.split(line.trim(), ' ', 1);
    if (!type) {
      callback(null);
      return;
    }

    const cmd = autocomplete.tryCompleter(type, this.commandProcessor);

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
