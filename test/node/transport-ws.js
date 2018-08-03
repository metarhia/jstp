'use strict';

const test = require('tap');

const jstp = require('../..');

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

test.test('WebSocket connection must connect to server', test => {
  jstp.ws.connect(
    app.name,
    null,
    null,
    `ws://localhost:${server.address().port}`,
    (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      test.end();
    }
  );
});

test.test('WebSocket connection must connect and inspect', test => {
  jstp.ws.connectAndInspect(
    app.name,
    null,
    interfaces,
    null,
    `ws://localhost:${server.address().port}`,
    (error, conn, api) => {
      connection = conn;
      test.assertNot(error, 'connectAndInspect must not return an error');

      interfaces.forEach(iface => {
        test.assert(iface in api, `api must include '${iface}'`);
        Object.keys(app.interfaces[iface]).forEach(method => {
          test.assert(
            method in api[iface],
            `api.${iface} must include ${method}`
          );
        });
      });

      test.end();
    }
  );
});

test.test('WebSocket connection must connect and inspect', test => {
  test.plan(1);

  test.throws(
    () =>
      jstp.ws.connect(
        app.name,
        null,
        null,
        '__illegal__url__'
      ),
    'connect must throw an error'
  );
});
