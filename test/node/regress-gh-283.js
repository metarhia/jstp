// Regression test for https://github.com/metarhia/jstp/issues/283

'use strict';

const tap = require('tap');
const jstp = require('../..');

const HANDSHAKE_TIMEOUT = 3000;

const app = new jstp.Application('app', {});
const server = jstp.net.createServer({
  applications: [app],
  heartbeatInterval: 100,
});

tap.plan(2);

server.listen(() => {
  jstp.net.connect('app', null, server.address().port, (error, connection) => {
    tap.assertNot(error, 'client must connect successfully');

    let heartbeatsCount = 0;

    connection.on('incomingMessage', message => {
      if (message.ping !== undefined) {
        heartbeatsCount++;
      }
    });

    setTimeout(() => {
      tap.assert(
        heartbeatsCount > 0,
        'client must have received some heartbeat messages'
      );

      connection.close();
      server.close();
    }, HANDSHAKE_TIMEOUT - 100);
  });
});
