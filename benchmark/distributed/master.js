'use strict';

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');

const jstp = require('../..');
const parseAddress = require('./parse-address');
const statistics = require('../statistics');

const args = yargs
  .option('address', {
    alias: 'a',
    describe: 'Address for master server to listen on',
    type: 'string',
    default: 'tcp://localhost:3000',
  })
  .options('report', {
    alias: 'r',
    describe: 'Report interval in ms',
    type: 'number',
    default: 10000,
  })
  .options('key', {
    alias: 'k',
    describe: 'Path to file that contains SSL certificate key',
    type: 'string',
    coerce: arg =>
      arg ? fs.readFileSync(path.resolve(__dirname, arg)) : undefined,
  })
  .options('cert', {
    alias: 'c',
    describe: 'Path to file that contains SSL certificate',
    type: 'string',
    coerce: arg =>
      arg ? fs.readFileSync(path.resolve(__dirname, arg)) : undefined,
  })
  .help()
  .alias('help', 'h').argv;

const { address, report: reportInterval, key, cert } = args;

const [error, parsed] = parseAddress(address);
if (error) {
  console.error(`Invalid master address: ${error.message}`);
  process.exit(1);
}

const { transport, listen: listenAddress } = parsed;

let startTimeHR = null;
let workersReportBuffer = [];
const reports = [];

const workers = [];
let server = null;
let master = null;

let serverAddress = null;

const application = {
  master: {
    registerServer: (connection, address, callback) => {
      server = connection;
      serverAddress = address;
      workers.forEach(worker => {
        worker.emitRemoteEvent('worker', 'connect', [serverAddress]);
      });
      callback(null);
    },

    registerWorker: (connection, callback) => {
      workers.push(connection);
      if (serverAddress) {
        connection.emitRemoteEvent('master', 'connect', [serverAddress]);
      }
      callback(null);
    },
  },
};

const eventHandlers = {
  master: {
    workerReport: (connection, count, mean, stdev) => {
      console.log(count, mean, stdev);
      workersReportBuffer.push({ count, mean, stdev });
    },
    serverReport: (connection, connections) => {
      server.connections = connections;
    },
  },
};

const config = {
  applications: [new jstp.Application('master', application, eventHandlers)],
  key,
  cert,
};

// Prevent Node.js from throwing DEPTH_ZERO_SELF_SIGNED_CERT.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

master = jstp[transport].createServer(config);

master.listen(listenAddress, () => {
  console.log(`Master server listening on ${address}\n`);
  startTimeHR = process.hrtime();

  let intervalTimerHR = process.hrtime();
  const report = () => {
    const timeFromStartHR = process.hrtime(startTimeHR);
    const timePassedHR = process.hrtime(intervalTimerHR);

    if (!workersReportBuffer.length) {
      return;
    }

    const timeFromStart = timeFromStartHR[0] * 1e9 + timeFromStartHR[1];
    const timePassed = timePassedHR[0] * 1e9 + timePassedHR[1];

    const sample = statistics.combineSamples(workersReportBuffer);
    if (sample.count === 0) {
      sample.mean = 0;
      sample.stdev = 0;
    }

    workersReportBuffer = [];
    reports.push([sample, server.connections, timeFromStartHR]);

    const stat = statistics.combineSamples(reports.map(element => element[0]));

    const logStats = (sample, timePassed) => {
      console.log(`Current stats:
        RPS                : ${(sample.count / timePassed) * 1e9}
        Response time mean : ${sample.mean * 1e-6} ms
        Response time stdev: ${sample.stdev * 1e-6} ms\n`);
    };

    logStats(sample, timePassed);
    logStats(stat, timeFromStart);

    console.log(`Current connections to server: ${server.connections}`);
    console.log('\n' + '='.repeat(80) + '\n');
    intervalTimerHR = process.hrtime();
  };

  setTimeout(() => {
    setInterval(report, reportInterval);
  }, reportInterval);
});

process.on('SIGINT', () => {
  console.log('\nMaster server is being closed');
  master.close(error => {
    if (error) {
      console.log(`Error occured when closing:\n${error}`);
      if (transport === 'ipc') {
        fs.unlink(listenAddress);
      }
    }
    process.exit(0);
  });
});
