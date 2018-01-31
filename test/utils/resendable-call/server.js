'use strict';

const jstp = require('../../..');

const appName = 'application';
const interfaces = {
  iface: {
    method: (connection, callback) => {
      process.send(['callRecieved']);
      callback(null);
    },
  },
};

const getSessionCallbacks = new Map();
const sessionStorageProvider = {
  isAsync: () => true,
  get: (id, callback) => {
    getSessionCallbacks.set(id, callback);
    process.send(['getSession', id]);
  },
  set: (id, session) => {
    process.send(['setSession', id, session.toString()]);
  },
};

process.on('message', ([message, ...args]) => {
  switch (message) {
    case 'getSessionResponse': {
      if (getSessionCallbacks.has(args[0])) {
        const session = args[1] ? jstp.Session.fromString(args[1]) : undefined;
        getSessionCallbacks.get(args[0])(session);
      }
      break;
    }
  }
});

const application = new jstp.Application(appName, interfaces);
const serverConfig = { applications: [application], sessionStorageProvider };
const server = jstp.net.createServer(serverConfig);

server.on('connect', (connection) => {
  sessionStorageProvider.set(connection.session.id, connection.session);
});

server.listen(0, () => {
  process.send(['listening', server.address().port]);
});
