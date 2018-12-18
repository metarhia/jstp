'use strict';

const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const statistics = require('./statistics');

const yargsParser = require('yargs-parser');

const args = yargsParser(
  process.argv.slice(2),
  {
    alias: {
      workers: ['W'],
      connections: ['C'],
      requests: ['R'],
      size: ['S'],
    },
  }
);

const {
  workers: workersAmount,
  connections: connectionsPerWorker,
  requests: requestsPerConnection,
  size: argumentSize,
} = args;

const server = cp.fork(
  path.join(__dirname, 'server'),
  [workersAmount * connectionsPerWorker],
  { stdin: 'pipe' }
);
let socket;

let serverExited = false;

const workers = new Array(workersAmount);
const workersExited = new Array(workersAmount);

const results = new Array(workersAmount);
let workersConnected = 0;
let workersFinished = 0;

let benchStartedHR;

server.on('exit', exitCode => {
  serverExited = true;
  if (exitCode !== 0) {
    terminate();
  }
});

server.on('error', terminate);

server.on('message', ([type, payload]) => {
  if (type !== 'started') {
    return;
  }
  socket = payload;

  const onWorkerExitFactory = index => exitCode => {
    workersExited[index] = true;
    if (exitCode !== 0) {
      terminate();
    }
  };

  for (let i = 0; i < workersAmount; i++) {
    workers[i] = cp.fork(path.join(__dirname, 'worker'), [], { stdin: 'pipe' });

    workers[i].on('exit', onWorkerExitFactory(i));
    workers[i].on('message', workerListener);
    workers[i].send(['connect', socket, connectionsPerWorker, argumentSize]);
  }
});

function workerListener([type, payload]) {
  if (type === 'connected') {
    workersConnected++;

    if (workersConnected === workersAmount) {
      benchStartedHR = process.hrtime();
      for (let i = 0; i < workersAmount; i++) {
        workers[i].send(['start', requestsPerConnection]);
      }
    }
  } else if (type === 'finished') {
    results[workersFinished] = payload;
    workersFinished++;

    if (workersFinished === workersAmount) {
      outputResults(process.hrtime(benchStartedHR));
    }
  }
}

function outputResults(benchTimeHR) {
  const count = workersAmount * connectionsPerWorker * requestsPerConnection;
  const mean = statistics.mean(results.map(result => result[0]));

  const sum = results.reduce(
    (previous, current) =>
      previous + Math.pow(current[1], 2) + Math.pow(current[0] - mean, 2),
    0
  );
  const stdev = Math.sqrt(sum / workersAmount);

  const benchTime = benchTimeHR[0] * 1e9 + benchTimeHR[1];
  const erps = count * 1e9 / benchTime;

  server.send(['stop']);
  console.log(`
    Requests sent:                    ${count}
    Mean time of one request:         ${mean * 1e-6} (ms)
    Stdev of time of one request:     ${stdev * 1e-6} (ms)
    Estimated RPS:                    ${erps}
  `);
  process.exit(0);
}

function terminate() {
  console.warn(
    '\nBenchmark is being terminated due to an error or signal termination\n'
  );
  workers.filter((_, index) => !workersExited[index])
    .forEach(worker => {
      worker.kill('SIGKILL');
    });

  if (!serverExited) {
    server.kill('SIGINT');
    setTimeout(() => {
      if (!serverExited) {
        server.kill('SIGKILL');
        console.warn('Master process was not able to close server gracefully');
        fs.unlinkSync(socket);
      }
    }, 5000);
  }

  process.exit(0);
}
