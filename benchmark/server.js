'use strict';

const os = require('os');
const path = require('path');

const jstp = require('..');

const maxConnections = +process.argv[2];

const app = new jstp.Application('app', {
  iface: {
    method(connection, argument, callback) {
      callback(null);
    },
  },
});

const server = jstp.net.createServer([app]);
server.maxConnections = maxConnections;

const socket = path.join(
  process.platform === 'win32' ? '\\\\.\\pipe' : os.tmpdir(),
  'jstp-ipc-test'
);

const terminate = () => {
  server.close();
  process.exit(0);
};

process.on('message', ([type]) => {
  if (type === 'stop') {
    terminate();
  }
});

process.on('SIGINT', terminate);

server.listen(socket, error => {
  if (error) {
    console.error(error);
  }

  console.log(`Server listening on ${socket} 🚀`);
  process.send(['started', socket]);
});
