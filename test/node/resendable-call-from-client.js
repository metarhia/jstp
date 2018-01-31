'use strict';

const test = require('tap');

const cp = require('child_process');
const path = require('path');

const jstp = require('../..');

const appName = 'application';

const sessionStorage = new Map();

let connection;
const client = {
  session: null,
};
let initialConnection = true;
let callsRecievedByServer = 0;

let server = createServer();

function createServer() {
  const server = cp.fork(
    path.join(__dirname, '../utils/resendable-call/server.js')
  );

  server.on('message', ([message, ...args]) => {
    switch (message) {
      case 'error':
        test.fail(args[0].message);
        break;
      case 'listening':
        (initialConnection ? connect : reconnect)(args[0]);
        break;
      case 'getSession':
        server.send([
          'getSessionResponse',
          args[0],
          sessionStorage.get(args[0]),
        ]);
        break;
      case 'setSession':
        sessionStorage.set(args[0], args[1]);
        if (initialConnection) {
          call();
        }
        break;
      case 'callRecieved':
        if (++callsRecievedByServer !== 1) {
          test.fail('server must recieve only one call');
        }
        break;
    }
  });

  return server;
}

let amountOfCalls = 0;
function call() {
  amountOfCalls++;
  if (amountOfCalls !== 2) {
    return;
  }
  connection.callMethodWithResend('iface', 'method', [], (error) => {
    test.assertNot(error, 'must not encounter an error');

    connection.close();
    server.kill('SIGKILL');
    test.end();
  });
  server.kill('SIGKILL');
  server = createServer();
}

function connect(port) {
  jstp.net.connect(
    appName,
    client,
    port,
    (error, conn, session) => {
      test.assertNot(error, 'must connect without errors');

      connection = conn;
      connection.on('error', (error) => {
        if (error.code !== 'ECONNRESET') {
          test.fail('must not encounter errors other than `ECONNRESET`');
        }
      });

      client.session = session;
      initialConnection = false;

      call();
    }
  );
}

function reconnect(port) {
  jstp.net.reconnect(connection, port, (error, conn) => {
    test.assertNot(error, 'must connect without errors');

    connection = conn;
    connection.on('error', (error) => {
      if (error.code !== 'ECONNRESET') {
        test.fail('must not encounter errors other then `ECONNRESET`');
      }
    });
  });
}
