'use strict';

const test = require('tap').test;

const jstp = require('../..');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

test('must perform an anonymous handshake', (test) => {
  test.plan(3);

  const server = jstp.tcp.createServer(3000, [application], app.authCallback);
  server.listen();
  const client = jstp.tcp.createClient({ host: 'localhost', port: 3000 });

  client.connectAndHandshake(app.name, null, null,
    (error, connection) => {
      test.assertNot(error, 'must be no error');
      test.equal(connection.username, null, 'username must be null');
      test.equal(connection.sessionId, app.sessionId,
        'session id must be equal to the one provided by authCallback');
      client.disconnect();
      server.close();
    });
});
