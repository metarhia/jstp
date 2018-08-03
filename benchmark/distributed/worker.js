'use strict';

const yargs = require('yargs');

const jstp = require('../..');
const parseAddress = require('./parse-address');
const statistics = require('../statistics');

const args = yargs
  .option('address', {
    alias: 'a',
    describe: 'Address of master server',
    type: 'string',
    default: 'tcp://localhost:3000',
  })
  .option('connection', {
    alias: 'c',
    describe: 'Amount of connections',
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
  .help()
  .alias('help', 'h').argv;

const {
  address,
  size: argumentSize,
  connection: connectionAmount,
  interval: requestInterval,
  report: reportInterval,
} = args;

const [error, parsed] = parseAddress(address);
if (error) {
  console.error(`Invalid master address: ${error.message}`);
  process.exit(1);
}

const { transport, connect: masterAddress } = parsed;

// Prevent Node.js from throwing DEPTH_ZERO_SELF_SIGNED_CERT.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let api = null;
const connections = new Array(connectionAmount);

let requestTimer = null;
let reportTimer = null;

let reportCycleStartHR = null;

let responseTimesHR = [];

const argument = '0'.repeat(argumentSize);

let requests = 0;

const createConnection = (index, address) => {
  jstp[transport].connectAndInspect(
    'server',
    null,
    ['server'],
    ...address,
    (error, connection) => {
      if (error) {
        console.error(`Could not connect to server:\n${error}`);
        return;
      }

      connections[index] = connection;
    }
  );
};

const report = () => {
  const req = requests;
  requests = 0;
  const responseTimes = responseTimesHR.map(
    ([seconds, nanoseconds]) => seconds * 1e9 + nanoseconds
  );
  responseTimesHR = [];
  const mean = statistics.mean(responseTimes) || 0;
  const stdev = statistics.stdev(responseTimes, mean) || 0;
  const timePassedHR = process.hrtime(reportCycleStartHR);
  console.log(
    `${req} requests in ${timePassedHR[0]}s\n` +
      `Mean response time: ${mean * 1e-6} ms, stdev: ${stdev * 1e-6} ms`
  );
  api.master.emit('workerReport', req, mean, stdev);
  reportCycleStartHR = process.hrtime();
};

const request = () => {
  const startTimeHR = process.hrtime();
  connections.forEach(connection => {
    connection.remoteProxies['server'].method(argument, (error, data) => {
      if (error) {
        console.error(`Error during call:\n${error}`);
        return;
      }
      requests++;
      responseTimesHR.push(process.hrtime(startTimeHR));
      if (data !== argument) {
        console.error('Server returned invalid data');
      }
    });
  });
};

jstp[transport].connectAndInspect(
  'master',
  null,
  ['master'],
  ...masterAddress,
  (error, connection, master) => {
    if (error) {
      console.error(`Couldn't connect to master:\n${error}`);
      return;
    }

    api = master;

    api.master.on('connect', address => {
      for (let i = 0; i < connectionAmount; i++) {
        createConnection(i, address);
      }
    });

    api.master.registerWorker(error => {
      if (error) {
        console.error(`Couldn't register worker:\n${error}`);
        return;
      }

      reportCycleStartHR = process.hrtime();
      reportTimer = setInterval(report, reportInterval);
      requestTimer = setInterval(request, requestInterval);
    });
  }
);

process.on('SIGINT', () => {
  console.log('\nWorker is being closed');
  clearInterval(requestTimer);
  clearInterval(reportTimer);
  connections.forEach(connection => {
    connection.close();
  });
  process.exit(0);
});
