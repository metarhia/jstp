'use strict';

const test = require('tap');

const fs = require('fs');
const path = require('path');

const jstp = require('../..');

// Prevent Node.js from throwing DEPTH_ZERO_SELF_SIGNED_CERT.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const key = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/cert/test.key')
);
const cert = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/cert/test.crt')
);

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

const interfaces = Object.keys(app.interfaces);

let server;
let connection;

test.beforeEach(done => {
  server = jstp.wss.createServer({ applications: [application], key, cert });
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

test.test('WSS connection must connect to server', test => {
  jstp.wss.connect(
    app.name,
    null,
    null,
    `wss://localhost:${server.address().port}`,
    (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      test.end();
    }
  );
});

test.test('WSS connection must connect and inspect', test => {
  jstp.wss.connectAndInspect(
    app.name,
    null,
    interfaces,
    null,
    `wss://localhost:${server.address().port}`,
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

test.test('WSS connection must connect and inspect', test => {
  test.plan(1);

  test.throws(
    () => jstp.wss.connect(app.name, null, null, '__illegal__url__'),
    'connect must throw an error'
  );
});
