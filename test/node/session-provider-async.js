'use strict';

const test = require('tap');

const jstp = require('../..');

const APP_NAME = 'APP_NAME';
const TOKEN = 'TOKEN';

const interfaces = {
  iface: {
    first(connection, token, callback) {
      connection.session.set(TOKEN, token);
      callback(null);
    },
    second(connection, callback) {
      callback(null, connection.session.get(TOKEN));
    },
  },
};

const application = new jstp.Application(APP_NAME, interfaces);

const TIMEOUT = 100;
const sessionStorageProvider = {
  map: new Map(),
  set(sessionId, session) {
    setTimeout(() => {
      this.map.set(sessionId, session.toString());
    }, TIMEOUT);
  },
  get(sessionId, callback) {
    setTimeout(() => {
      callback(jstp.Session.fromString(this.map.get(sessionId)));
    }, TIMEOUT);
  },
  isAsync: () => true,
};

const serverConfig = { applications: [application], sessionStorageProvider };
const server = jstp.net.createServer(serverConfig);
const client = { session: null };

const reconnect = (connection, port) => {
  jstp.net.reconnect(connection, port, (error, connection) => {
    test.error(error, 'must not encounter error on reconnection');
    connection.callMethod('iface', 'second', [], (error, token) => {
      test.error(error, 'call to iface.second must not return an error');
      test.equal(token, TOKEN,
        'second method must return the same token passed to first method'
      );
      connection.close();
      connection.once('close', () => {
        server.close();
        test.end();
      });
    });
  });
};

server.listen(0, () => {
  const port = server.address().port;
  jstp.net.connect(APP_NAME, client, port, (error, connection) => {
    test.error(error, 'handshake must not return an error');
    connection.callMethod('iface', 'first', [TOKEN], (error) => {
      test.error(error, 'call to iface.first must not return an error');
      connection.close();
      connection.once('close', () => {
        setTimeout(() => {
          reconnect(connection, port);
        }, TIMEOUT * 10);
      });
    });
  });
});
