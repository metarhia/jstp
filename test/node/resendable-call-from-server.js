'use strict';

const test = require('tap');

const jstp = require('../..');

const appName = 'application';

let callsReceivedByClient = 0;
const interfaces = {
  iface: {
    method: (connection, callback) => {
      callsReceivedByClient++;
      if (callsReceivedByClient === 1) {
        test.pass('Client must receive first call message');
        reconnect();
      } else if (callsReceivedByClient === 2) {
        test.pass('Client must receive second call message');
        callback(null);
      } else {
        test.fail('Client must not receive more than two call messages');
      }
    },
  },
};

let server;
let port;
let connection;
const client = {
  session: null,
  application: new jstp.Application(appName, interfaces),
};

function createServer(callback) {
  const application = new jstp.Application(appName, interfaces);
  server = jstp.net.createServer({ applications: [application] });
  server.listen(0, () => {
    port = server.address().port;
    callback();
  });
  server.once('connect', connection => {
    process.nextTick(() => {
      connection.callMethodWithResend('iface', 'method', [], error => {
        test.error(error, 'callMethodWithResend must not encounter an error');
        test.pass('callback must be called');
        server.close();
        connection.close();
      });
    });
  });
}

function connect() {
  jstp.net.connect(appName, client, port, (error, conn, session) => {
    test.error(error, 'must connect without errors');
    connection = conn;
    client.session = session;
  });
}

function reconnect() {
  connection.close();
  connection.once('close', () => {
    jstp.net.reconnect(connection, port, (error, conn) => {
      test.error(error, 'must reconnect without errors');
      connection = conn;
    });
  });
}

test.plan(6);
createServer(connect);
