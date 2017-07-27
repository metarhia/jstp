'use strict';

const test = require('tap');
global.WebSocket = require('websocket').w3cwebsocket;
const wsBrowser = require('../../lib/ws-browser');

const jstp = require('../..');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

const interfaces = Object.keys(app.interfaces);

let server;
let connection;

test.beforeEach((done) => {
  server = jstp.ws.createServer([application]);
  server.listen(0, done);
});

test.afterEach((done) => {
  if (connection) {
    connection.close();
    connection = null;
  }
  server.close();
  done();
});

const webSocketAddress = (address, transport) => {
  const addr = transport === 'WebSocket' ? [null] : [];
  addr.push(`ws://localhost:${address.port}`);
  return addr;
};

const runTest = (transport, transportName) => {
  test.test(`${transportName} must connect to server`, (test) => {
    transport.connect(
      app.name,
      null,
      ...webSocketAddress(server.address(), transportName),
      (error, conn) => {
        connection = conn;
        test.assertNot(error, 'connect must not return an error');
        test.end();
      }
    );
  });

  test.test(`${transportName} must connect and inspect`, (test) => {
    transport.connectAndInspect(
      app.name,
      null,
      interfaces,
      ...webSocketAddress(server.address(), transportName),
      (error, conn, api) => {
        connection = conn;
        test.assertNot(error, 'connectAndInspect must not return an error');

        interfaces.forEach((iface) => {
          test.assert(iface in api, `api must include '${iface}'`);
          Object.keys(app.interfaces[iface]).forEach(method =>
            test.assert(method in api[iface],
              `api.${iface} must include ${method}`)
          );
        });

        test.end();
      }
    );
  });

  test.test(`${transportName} must throw an error on illegal url`, (test) => {
    test.plan(1);
    const address = transportName === 'WebSocket' ? [null] : [];
    address.push('__illegal__url__');

    const connect = () => transport.connect(app.name, null, ...address,
      (error) => {
        test.assert(error, 'connect must return an error');
      }
    );

    if (transportName === 'WebSocket') {
      test.throws(connect, 'connect must throw an error');
    } else {
      connect();
    }
  });
};

runTest(jstp.ws, 'WebSocket');
runTest(wsBrowser, 'W3C WebSocket');
