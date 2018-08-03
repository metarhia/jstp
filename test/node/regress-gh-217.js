// Regression test for https://github.com/metarhia/jstp/issues/217
//
// A confusing thing about this test is that it doesn't seem to have any
// assertions except the one that tests if `jstp.net.connect()` has succeeded.
// In fact, the crux of the test is that it just must complete.  When the
// subject bug is present, it will crash with an unhandled exception.  This
// exception happens in an asynchronous context, so `tap.doesNotThrow()` isn't
// used here, tap will handle it top-level via a domain.

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
    'app',
    null,
    server.address().port,
    (error, connection) => {
      tap.assertNot(error, 'client must connect successfully');

      connection.close();

      setTimeout(() => {
        server.close();
      }, HANDSHAKE_TIMEOUT + 100);
    }
  );
});
