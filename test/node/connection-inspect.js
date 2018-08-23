'use strict';

const test = require('tap');

const jstp = require('../..');

const app = require('../fixtures/application.js');
const application = new jstp.Application(app.name, app.interfaces);

let server;
let connection;

test.beforeEach(done => {
  server = jstp.net.createServer([application]);
  server.listen(0, () => done());
});

test.afterEach(done => {
  if (connection) {
    connection.close();
    connection = null;
  }
  server.close();
  done();
});

test.test('must process inspect messages', test => {
  const expectedInterfaces = Object.keys(app.interfaces);
  const expectedTests = expectedInterfaces.reduce(
    (tests, iface) => tests + Object.keys(app.interfaces[iface]).length + 1,
    1
  );

  test.plan(expectedTests);
  const port = server.address().port;
  jstp.net.connect(app.name, null, port, (error, conn) => {
    connection = conn;
    test.assertNot(error, 'must connect to server');

    expectedInterfaces.forEach(iface => {
      connection.inspectInterface(iface, (error, methods) => {
        test.assertNot(error, `must inspect ${iface}`);
        Object.keys(app.interfaces[iface]).forEach(
          method => test.assert(
            method in methods, `api.${iface} must include ${method}`
          )
        );
      });
    });
  });
});

test.test('must generate remote api after inspect', test => {
  const expectedInterfaces = Object.keys(app.interfaces);

  const port = server.address().port;
  jstp.net.connectAndInspect(app.name, null, expectedInterfaces, port,
    (error, conn, api) => {
      connection = conn;
      test.assertNot(error, 'inspect must not return an error');

      expectedInterfaces.forEach(iface => {
        test.assert(iface in api, `api must include '${iface}'`);
        Object.keys(app.interfaces[iface]).forEach(
          method => test.assert(
            method in api[iface], `api.${iface} must include ${method}`
          )
        );
      });
      test.end();
    }
  );
});

test.test('remote proxy must call a remote method', test => {
  const port = server.address().port;
  jstp.net.connectAndInspect(app.name, null, ['someService'], port,
    (error, conn, api) => {
      connection = conn;
      test.assertNot(error, 'inspect must not return an error');
      const word = 'word';
      api.someService.say(word, (error, result) => {
        test.assertNot(error, 'remote method must be called without error');
        test.strictEqual(result, word,
          'remote method should return a proper result');
        test.end();
      });
    }
  );
});

test.test('must return an error if interface does not exist', test => {
  const port = server.address().port;
  jstp.net.connectAndInspect(
    app.name, null, ['__nonexistent__interface__'], port, (error, conn) => {
      connection = conn;
      test.assert(error, 'must return an error');
      test.equal(error.code, jstp.ERR_INTERFACE_NOT_FOUND,
        'error must be an ERR_INTERFACE_NOT_FOUND');
      test.end();
    });
});
