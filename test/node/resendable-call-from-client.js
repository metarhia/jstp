'use strict';

const test = require('tap');

const jstp = require('../..');

const appName = 'application';

let callsReceivedByServer = 0;
const interfaces = {
  iface: {
    method: (connection, callback) => {
      callsReceivedByServer++;
      if (callsReceivedByServer === 1) {
        test.pass('Server must receive first call message');
        reconnect();
      } else if (callsReceivedByServer === 2) {
        test.pass('Server must receive second call message');
        callback(null);
      } else {
        test.fail('Server must not receive more than two call messages');
      }
    },
  },
};

let server;
const sessionStorageProvider = new jstp.SimpleSessionStorageProvider();

let connection;
const client = {
  session: null,
};

function createServer(callback) {
  const application = new jstp.Application(appName, interfaces);
  server = jstp.net.createServer({
    applications: [application],
    sessionStorageProvider,
  });
  server.listen(0, () => {
    callback(server.address().port);
  });
}

function connect(port, callback) {
  jstp.net.connect(
    appName,
    client,
    port,
    (error, conn, session) => {
      test.error(error, 'must connect without errors');
      connection = conn;
      client.session = session;
      callback();
    }
  );
}

function reconnect() {
  connection.close();
  connection.once('close', () => {
    server.close();
    createServer(port => {
      jstp.net.reconnect(connection, port, (error, conn) => {
        test.error(error, 'must reconnect without errors');
        connection = conn;
      });
    });
  });
}

test.plan(6);

createServer(port => {
  connect(
    port,
    () => {
      connection.callMethodWithResend('iface', 'method', [], error => {
        test.error(error, 'callMethodWithResend must not encounter an error');
        test.pass('callback must be called');
        connection.close();
        server.close();
      });
    }
  );
});
