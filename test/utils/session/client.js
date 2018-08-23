'use strict';

const jstp = require('../../..');

const appName = 'testApp';
const iface = 'iface';
const method = 'method';

let connection = null;
const client = { session: null };

const connect = port => {
  jstp.net.connect(appName, null, port, (error, conn, session) => {
    if (error) {
      process.send(['error', error]);
    }
    connection = conn;
    client.session = session;
    connection.callMethod(iface, method, [], error => {
      if (error) {
        process.send(['error', error]);
      }
    });
  });
};

const sendSession = () => {
  process.send(['session', client.session.toString()]);
};

const reconnect = (port, serializedSession) => {
  client.session = jstp.Session.fromString(serializedSession);
  jstp.net.connect(appName, client, port, (error, conn) => {
    if (error) {
      process.send(['error', error]);
    }
    connection = conn;

    connection.on('event', (iface, event) => {
      process.send(['event', iface, event]);
    });
  });
};

process.on('message', ([message, ...args]) => {
  switch (message) {
    case 'connect':
      connect(...args);
      break;
    case 'sendSession':
      sendSession();
      break;
    case 'reconnect':
      reconnect(...args);
      break;
  }
});
