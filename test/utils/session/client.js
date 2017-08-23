'use strict';

const jstp = require('../../..');
const sessionSerde = require('./session-serde');

const appName = 'testApp';
const iface = 'iface';
const method = 'method';

let connection = null;
const client = { session: null };

const connect = (port) => {
  jstp.net.connect(appName, null, port, (error, conn, session) => {
    if (error) {
      process.send(['error', error]);
    }
    connection = conn;
    client.session = session;
    connection.callMethod(iface, method, [], (error) => {
      if (error) {
        process.send(['error', error]);
      }
    });
  });
};

const getSession = () => {
  process.send(['session', sessionSerde.serialize(client.session)]);
};

const reconnect = (port, serializedSession) => {
  client.session = sessionSerde.deserialize(serializedSession);
  jstp.net.connect(appName, client, port, (error, conn, session) => {
    if (error) {
      process.send(['error', error]);
    }
    connection = conn;
    client.session = session;
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
    case 'getSession':
      getSession();
      break;
    case 'reconnect':
      reconnect(...args);
      break;
  }
});
