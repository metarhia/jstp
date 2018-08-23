'use strict';

const test = require('tap');
global.WebSocket = require('websocket').w3cwebsocket;
const jstp = require('../..');
const w3c = require('../../lib/ws-browser');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

const interfaces = Object.keys(app.interfaces);

let server;
let connection;

test.beforeEach(done => {
  server = jstp.ws.createServer([application]);
  server.listen(0, done);
});

test.afterEach(done => {
  if (connection) {
    connection.close();
    connection = null;
  }
  server.close();
  done();
});

test.test('W3C WebSocket connection must connect to server', test => {
  w3c.connect(
    app.name,
    null,
    `ws://localhost:${server.address().port}`,
    (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      test.end();
    }
  );
});

test.test('W3C WebSocket connection must connect and inspect', test => {
  w3c.connectAndInspect(
    app.name,
    null,
    interfaces,
    `ws://localhost:${server.address().port}`,
    (error, conn, api) => {
      connection = conn;
      test.assertNot(error, 'connectAndInspect must not return an error');

      interfaces.forEach(iface => {
        test.assert(iface in api, `api must include '${iface}'`);
        Object.keys(app.interfaces[iface]).forEach(method => {
          test.assert(method in api[iface],
            `api.${iface} must include ${method}`);
        });
      });

      test.end();
    }
  );
});

test.test('W3C WebSocket connection must connect and inspect', test => {
  test.plan(1);

  w3c.connect(app.name, null, '__illegal__url__',
    error => {
      test.assert(error, 'connect must return an error');
    }
  );
});
