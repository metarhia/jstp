'use strict';

const cp = require('child_process');
const path = require('path');
const yargs = require('yargs');

const args = yargs
  .option('address', {
    alias: 'a',
    describe: 'Address of master server',
    type: 'string',
    default: 'tcp://localhost:3000',
  })
  .option('connection', {
    alias: 'c',
    describe: 'Amount of connections per worker',
    type: 'number',
    default: 128,
  })
  .option('interval', {
    alias: 'i',
    describe: 'Interval of requests sent by connection in ms',
    type: 'number',
    default: 10,
  })
  .option('size', {
    alias: 's',
    describe: 'Size of argument to call remote method with',
    type: 'number',
    default: 0,
  })
  .option('report', {
    alias: 'r',
    describe: 'Report interval in ms',
    type: 'number',
    default: 10000,
  })
  .option('workers', {
    alias: 'w',
    describe: 'Amount of workers',
    type: 'number',
  })
  .demandOption(['workers'])
  .help()
  .alias('help', 'h')
  .argv;

const {
  address,
  size,
  connection,
  interval,
  report,
  workers,
} = args;

for (let i = 0; i < workers; i++) {
  cp.fork(
    path.join(__dirname, 'worker'),
    ['-a', address, '-c', connection, '-i', interval, '-s', size, '-r', report],
    { stdio: ['ignore', 'ignore', process.stderr, 'ipc'] }
  );
}
