'use strict';

const test = require('tap');

const cp = require('child_process');
const path = require('path');

const jstp = require('../..');

let client = createClient();

const appName = 'application';
const interfaces = {
  iface: {
    method: (conn, callback) => {
      callback(null);
    },
  },
};

const application = new jstp.Application(appName, interfaces);
const serverConfig = { applications: [application] };
const server = jstp.net.createServer(serverConfig);

client.on('message', ([message, ...args]) => {
  switch (message) {
    case 'error':
      test.fail(args[0].message);
      break;
    case 'connected':
      client.kill('SIGKILL');
      server
        .getClientsArray()[0]
        .callMethodWithResend('iface', 'method', [], (error) => {
          test.assertNot(error, 'must not return an error');
          server.close();
          client.kill('SIGKILL');
          test.end();
        });
      client = createClient();
      client.send(['reconnect', server.address().port, args[0]]);
      break;
  }
});

server.listen(0, () => {
  client.send(['connect', server.address().port]);
});

function createClient() {
  return cp.fork(path.join(__dirname, '../utils/resendable-call/client.js'));
}
