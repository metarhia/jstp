'use strict';

const os = require('os');
const path = require('path');
const test = require('tap');

const jstp = require('../..');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

const interfaces = Object.keys(app.interfaces);

let server;
let connection;

const socket = path.join(
  process.platform === 'win32' ? '\\\\.\\pipe' : os.tmpdir(),
  'jstp-ipc-test'
);

test.beforeEach(done => {
  server = jstp.net.createServer([application]);
  server.listen(socket, done);
});

test.afterEach(done => {
  if (connection) {
    connection.close();
    connection = null;
  }
  server.close();
  server.on('close', done);
});

test.test('IPC connection must connect to server', test => {
  jstp.net.connect(
    app.name,
    null,
    socket,
    (error, conn) => {
      connection = conn;
      test.assertNot(error, 'connect must not return an error');
      test.end();
    }
  );
});

test.test('IPC connection must connect and inspect', test => {
  jstp.net.connectAndInspect(
    app.name,
    null,
    interfaces,
    socket,
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

test.test('IPC connection must throw an error on illegal address', test => {
  jstp.net.connect(
    app.name,
    null,
    '__invalid_address__',
    error => {
      test.assert(error, 'connect must return an error');
      test.equals(error.code, 'ENOENT', 'error must be ENOENT');
      test.end();
    }
  );
});
