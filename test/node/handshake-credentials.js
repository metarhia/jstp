'use strict';

const test = require('tap').test;

const jstp = require('../..');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

test('must perform a handshake with credentials', (test) => {
  test.plan(3);

  const server = jstp.tcp.createServer(3001, [application], app.authCallback);
  server.listen();
  const client = jstp.tcp.createClient({ host: 'localhost', port: 3001 });

  client.connectAndHandshake(app.name, app.login, app.password,
    (error, connection) => {
      test.assertNot(error, 'must be no error');
      test.equal(connection.username, app.login,
        'username must be same as the one passed with handshake');
      test.equal(connection.sessionId, app.sessionId,
        'session id must be equal to the one provided by authCallback');
      client.disconnect();
      server.close();
    });
});
