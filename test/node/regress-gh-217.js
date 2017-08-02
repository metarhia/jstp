// Regression test for https://github.com/metarhia/jstp/issues/217

'use strict';

const tap = require('tap');
const jstp = require('../..');

const HANDSHAKE_TIMEOUT = 3000;

const app = new jstp.Application('app', {});
const server = jstp.net.createServer({
  applications: [app],
  heartbeatInterval: 100,
});

tap.plan(1);

server.listen(() => {
  jstp.net.connect(
    'app', null, server.address().port,
    (error, connection) => {
      tap.assertNot(error, 'client must connect successfully');

      connection.close();

      setTimeout(() => {
        server.close();
      }, HANDSHAKE_TIMEOUT + 100);
    }
  );
});
