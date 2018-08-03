'use strict';

const test = require('tap');
const jstp = require('../..');

const app = new jstp.Application('app', {});
const server = jstp.net.createServer({ applications: [app] });

server.listen(() => {
  server.once('log', () => {
    test.pass('log event must be emmited');
  });

  jstp.net.connect(
    'app',
    null,
    server.address().port,
    (err, connection) => {
      test.assertNot(err, 'must connect successfully');

      connection.close();
      server.close();
    }
  );
});
