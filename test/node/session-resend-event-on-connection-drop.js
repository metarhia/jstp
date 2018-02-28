'use strict';

const test = require('tap');

const cp = require('child_process');
const path = require('path');

const jstp = require('../..');

let client = createClient();

const iface = 'iface';
const event = 'testEvent';
const ifaces = {
  iface: {
    method: (connection, callback) => {
      client.send(['sendSession']);
      callback(null);
    },
  },
};

const application = new jstp.Application('testApp', ifaces);
const serverConfig = {
  applications: [application],
  clientExpirationTime: 1000,
};
const server = jstp.net.createServer(serverConfig);

client.on('message', ([message, ...args]) => {
  switch (message) {
    case 'error':
      console.error(args[0].message);
      test.fail('must not encounter an error');
      break;
    case 'session':
      session(...args);
      break;
  }
});

server.listen(0, () => {
  client.send(['connect', server.address().port]);
});

function createClient() {
  return cp.fork(path.join(__dirname, '../utils/session/client'));
}

function session(serializedSession) {
  client.kill('SIGKILL');
  server.getClientsArray()[0].emitRemoteEvent(iface, event, []);
  client = createClient();
  client.on('message', ([message, ...args]) => {
    switch (message) {
      case 'error':
        console.error(args[0].message);
        test.fail('must not encounter an error');
        break;
      case 'event':
        handleEvent(...args);
        break;
    }
  });
  setTimeout(() => {
    client.send(['reconnect', server.address().port, serializedSession]);
  }, 2000);
}

function handleEvent(ifaceName, eventName) {
  test.equals(ifaceName, iface, 'interface name must match');
  test.equals(eventName, event, 'event name must match');
  client.kill();
  server.close();
}
