'use strict';

const test = require('tap');

const fs = require('fs');
const path = require('path');

const jstp = require('../..');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

const interfaces = Object.keys(app.interfaces);

// Prevent Node.js from throwing DEPTH_ZERO_SELF_SIGNED_CERT.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const key = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/cert/test.key')
);
const cert = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/cert/test.crt')
);

let server;
let connection;

let port;

test.beforeEach(done => {
  server = jstp.tls.createServer({ applications: [application], key, cert });
  server.listen(0, () => {
    port = server.address().port;
    done();
  });
});

test.afterEach(done => {
  if (connection) {
    connection.close();
    connection = null;
  }
  server.close();
  done();
});

test.test('TLS connection must connect to server', test => {
  jstp.tls.connect(
    app.name,
    null,
    port,
    (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      test.end();
    }
  );
});

test.test('TLS connection must connect and inspect', test => {
  jstp.tls.connectAndInspect(
    app.name,
    null,
    interfaces,
    port,
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

const invalidAddress = {
  host: '__invalid_host__',
  port,
};

test.test('TLS connection must throw an error on invalid address', test => {
  jstp.tls.connect(
    app.name,
    null,
    invalidAddress,
    error => {
      test.assert(error, 'connect must return an error');
      test.equals(error.code, 'ENOTFOUND', 'error must be ENOTFOUND');
      test.end();
    }
  );
});
