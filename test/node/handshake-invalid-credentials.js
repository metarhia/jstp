'use strict';

const test = require('tap').test;

const jstp = require('../..');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

test('must not perform a handshake with invalid credentials', (test) => {
  test.plan(2);

  const server = jstp.tcp.createServer(3002, [application], app.authCallback);
  server.listen();
  const client = jstp.tcp.createClient({ host: 'localhost', port: 3002 });

  client.connectAndHandshake(app.name, app.login, 'psssword',
    (error) => {
      test.assert(error, 'must be an error');
      test.equal(error.code, jstp.ERR_AUTH_FAILED,
        'error code must be ERR_AUTH_FAILED');
      client.disconnect();
      server.close();
    });
});
