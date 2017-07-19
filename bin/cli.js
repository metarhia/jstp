#!/usr/bin/env node

'use strict';

const readline = require('readline');

const Cli = require('../lib/cli/cli');

let rl = null;

const log = (msg) => {
  const userInput = rl.line;
  if (userInput) rl.clearLine();
  rl.output.write(msg);
  rl.write('\n');
  if (userInput) rl.write(userInput);
};

const finish = () => {
  rl.close();
  process.exit();
};

const cli = new Cli(log);

cli.on('exit', () => finish());

rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: cli.completer.bind(cli),
});

const prompt = rl.prompt.bind(rl);
rl.on('line', (line) => {
  cli.processLine(line, prompt);
});

rl.on('close', () => finish());

rl.on('SIGINT', () => finish());

rl.prompt(true);
