'use strict';

const test = require('tap');

const jstp = require('../..');

const app = require('../fixtures/application');

let server;
let connection;

test.afterEach(done => {
  if (connection) {
    connection.close();
    connection = null;
  }
  if (server) server.close();
  done();
});

test.test('must call event handler in application on remote event', test => {
  const expectedName = 'name';

  const eventHandlers = {
    someService: {
      name(connection, name) {
        test.assert(connection, 'must pass connection to event handler');
        test.equals(name, expectedName, 'must pass correct argument');
        test.end();
      },
    },
  };
  const application = new jstp.Application(app.name, {}, eventHandlers);
  server = jstp.net.createServer([application]);
  server.listen(0, () => {
    const port = server.address().port;
    jstp.net.connect(
      app.name,
      null,
      port,
      (error, conn) => {
        connection = conn;
        test.assertNot(error, 'must connect to server and perform handshake');
        connection.emitRemoteEvent('someService', 'name', [expectedName]);
      }
    );
  });
});
