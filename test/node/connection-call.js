'use strict';

const test = require('tap');

const jstp = require('../..');

const app = require('../fixtures/application');

const application = new jstp.Application(app.name, app.interfaces);
const serverConfig = {
  applications: [application],
  authPolicy: app.authCallback,
};

let server;
let connection;

test.beforeEach(done => {
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    jstp.net.connect(
      app.name,
      null,
      port,
      'localhost',
      (error, conn) => {
        test.assertNot(error, 'must connect to server and perform handshake');
        connection = conn;
        done();
      }
    );
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

test.test('must perform call with no arguments and no return value', test => {
  connection.callMethod('calculator', 'doNothing', [], error => {
    test.assertNot(error, 'callMethod must not return an error');
    test.end();
  });
});

test.test('must perform call with no arguments and return value', test => {
  connection.callMethod('calculator', 'answer', [], (error, result) => {
    test.assertNot(error, 'callMethod must not return an error');
    test.equal(result, 42);
    test.end();
  });
});

test.test('must perform call with arguments and return value', test => {
  connection.callMethod('calculator', 'divide', [20, 10], (error, result) => {
    test.assertNot(error, 'callMethod must not return an error');
    test.equal(result, 2);
    test.end();
  });
});

test.test('must perform call that returns an error', test => {
  connection.callMethod('calculator', 'divide', [10, 0], error => {
    test.assert(error, 'callMethod must return an error');
    test.equal(
      error.message,
      new jstp.RemoteError(new Error(app.expectedErrorMessage)).message
    );
    test.end();
  });
});

test.test('must return error on call to nonexistent interface', test => {
  connection.callMethod(
    '__nonexistent_interface__',
    '__nonexistent_method__',
    [],
    error => {
      test.assert(error, 'callMethod must return an error');
      test.equal(
        error.code,
        jstp.ERR_INTERFACE_NOT_FOUND,
        'error must be an ERR_INTERFACE_NOT_FOUND'
      );
      test.end();
    }
  );
});

test.test('must return error on call to nonexistent method', test => {
  connection.callMethod('calculator', '__nonexistent_method__', [], error => {
    test.assert(error, 'callMethod must return an error');
    test.equal(
      error.code,
      jstp.ERR_METHOD_NOT_FOUND,
      'error must be an ERR_METHOD_NOT_FOUND'
    );
    test.end();
  });
});
