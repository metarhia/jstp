'use strict';

const test = require('tap').test;

const jstp = require('../..');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

test('must handle inexistent application error', (test) => {
  test.plan(2);

  const server = jstp.tcp.createServer(3003, [application], app.authCallback);
  server.listen();

  const client = jstp.tcp.createClient({ host: 'localhost', port: 3003 });

  client.connectAndHandshake('inexistentApp', null, null,
    (error) => {
      test.assert(error, 'must be an error');
      test.equal(error.code, jstp.ERR_APP_NOT_FOUND,
        'error code must be ERR_APP_NOT_FOUND');
      client.disconnect();
      server.close();
    });
});
