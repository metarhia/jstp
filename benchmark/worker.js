'use strict';

const jstp = require('..');

const statistics = require('./statistics');

let connections;

let argument;

process.on('message', ([type, ...payload]) => {
  if (type === 'connect') {
    connections = new Array(payload[1]);
    connect(payload[0]);
    argument = '0'.repeat(payload[2]);
  } else if (type === 'start') {
    start(payload[0]);
  }
});

function connect(socket) {
  let connected = 0;
  const createConnection = (index) => {
    jstp.net.connectAndInspect(
      'app', null, ['iface'], socket, (error, conn) => {
        connected++;

        if (error) {
          console.error(`Could not connect to the server: ${error}`);
          return;
        }

        connections[index] = conn;

        if (connected === connections.length) {
          process.send(['connected']);
        }
      }
    );
  };

  for (let i = 0; i < connections.length; i++) {
    createConnection(i);
  }
}

function start(requests) {
  const responseTimesHR = new Array(connections.length);
  for (let i = 0; i < connections.length; i++) {
    responseTimesHR[i] = new Array(requests);
  }
  let responses = 0;
  let startTimeHR = null;

  const sendRequest = (connectionIndex, requestIndex) => {
    const timeOfStart = process.hrtime();
    connections[connectionIndex].remoteProxies.iface.method(argument, () => {

      responseTimesHR[connectionIndex][requestIndex] =
        process.hrtime(timeOfStart);

      responses++;
      if (responses === requests * connections.length) {
        process.send([
          'finished',
          prepareResults(responseTimesHR, process.hrtime(startTimeHR)),
        ]);
        connections.forEach(connection => connection.close());
        process.exit(0);
      }
    });
  };

  startTimeHR = process.hrtime();

  for (let i = 0; i < connections.length; i++) {
    for (let j = 0; j < requests; j++) {
      sendRequest(i, j);
    }
  }
}

function prepareResults(responseTimesHR, timeSpentHR) {
  const hrtimeToNSeconds = hrtime => hrtime[0] * 1e9 + hrtime[1];

  responseTimesHR = responseTimesHR.reduce(
    (previous, current) => previous.concat(current), []
  );

  const responseTimes = responseTimesHR.map(hrtimeToNSeconds);
  const timeSpent = hrtimeToNSeconds(timeSpentHR);

  const mean = statistics.mean(responseTimes);
  const stdev = statistics.stdev(responseTimes, mean);

  return [mean, stdev, timeSpent];
}
