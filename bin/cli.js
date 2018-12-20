#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const readline = require('readline');

const Cli = require('../lib/cli/cli');
const { setupHistory, getHistorySize } = require('../lib/cli/history');

let rl = null;

const args = yargs
  .option('verbose', {
    alias: 'v',
    type: 'count',
    describe: 'Verbosely print incoming and outgoing messages',
  })
  .option('no-reconnect', {
    alias: 'R',
    type: 'boolean',
    describe: 'Disable reconnection',
  })
  .option('heartbeat-interval', {
    alias: 'i',
    requiresArg: true,
    type: 'number',
    describe: 'Heartbeat interval in milliseconds',
  })
  .option('pretty-print', {
    alias: 'p',
    type: 'string',
    describe: 'Enable pretty-print. You can pass a string or a number' +
      ' to specify indentation',
  })
  .epilogue(`
Environment variables:
JSTP_CLI_HISTORY       path to the persistent CLI history file
JSTP_CLI_HISTORY_SIZE  controls how many lines of CLI history will be persisted,
                       must be a positive number
    `)
  .strict().argv;

const log = msg => {
  const userInput = rl.line;
  if (userInput) rl.clearLine();
  rl.output.write(msg + '\n' + rl._prompt);
  if (userInput) rl.write(userInput);
};

const finish = () => {
  rl.close();
  process.exit();
};

const cli = new Cli(log, args);

cli.on('exit', () => {
  if (rl._flushingHistory) {
    rl.once('flushHistory', finish);
  } else {
    finish();
  }
});

rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: cli.completer.bind(cli),
  historySize: getHistorySize(),
});

const prompt = rl.prompt.bind(rl);
rl.on('line', line => {
  cli.processLine(line, prompt);
});

rl.on('close', () => finish());

rl.on('SIGINT', () => finish());

setupHistory(rl, (err, message) => {
  if (err) {
    if (message) log(message);
    if (args.verbose !== 0) log(err.stack);
  }
  rl.prompt(true);
});
