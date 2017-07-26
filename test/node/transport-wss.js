'use strict';

const test = require('tap');

const fs = require('fs');
const path = require('path');
global.WebSocket = require('websocket').w3cwebsocket;
const wsBrowser = require('../../lib/ws-browser');

const jstp = require('../..');

// Prevent Node.js from throwing DEPTH_ZERO_SELF_SIGNED_CERT.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const key = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/cert/test.key'));
const cert = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/cert/test.crt'));

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

const interfaces = Object.keys(app.interfaces);

let server;
let connection;

test.beforeEach((done) => {
  server = jstp.wss.createServer({ applications: [application], key, cert });
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

const webSocketAdress = (adress, transport) => {
  const address = transport === 'WebSocket' ? [null] : [];
  address.push(`wss://localhost:${adress.port}`);
  return address;
};

const runTest = (transport, transportName) => {
  test.test(`${transportName} must connect to server`, (test) => {
    transport.connect(
      app.name,
      null,
      ...webSocketAdress(server.address(), transportName),
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
      ...webSocketAdress(server.address(), transportName),
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

runTest(jstp.wss, 'WebSocket');
runTest(wsBrowser, 'W3C WebSocket');
