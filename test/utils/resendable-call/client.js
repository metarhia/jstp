'use strict';

const jstp = require('../../..');

const appName = 'application';
const interfaces = {
  iface: {
    method: (connection, callback) => {
      callback(null);
    },
  },
};

const client = {
  session: null,
  application: new jstp.Application(appName, interfaces),
};

const connect = (port) => {
  jstp.net.connect(
    appName,
    client,
    port,
    (error, conn, session) => {
      if (error) {
        process.send(['error', error]);
      }
      client.session = session;
      process.send(['connected', session.toString()]);
    }
  );
};

const reconnect = (port, serializedSession) => {
  client.session = jstp.Session.fromString(serializedSession);
  jstp.net.connect(
    appName,
    client,
    port,
    (error) => {
      if (error) {
        process.send(['error', error]);
      }
    }
  );
};

process.on('message', ([message, ...args]) => {
  switch (message) {
    case 'connect':
      connect(...args);
      break;
    case 'reconnect':
      reconnect(...args);
      break;
  }
});
