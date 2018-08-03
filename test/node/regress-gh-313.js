'use strict';

const net = require('net');

const test = require('tap');
const jstp = require('../..');

const app = new jstp.Application('app', {});
const server = jstp.net.createServer({ applications: [app] });

server.listen(() => {
  jstp.net.connect(
    'app',
    null,
    server.address().port,
    (err, connection) => {
      test.assertNot(err, 'must connect successfully');

      test.assert(
        net.isIP(connection.remoteAddress),
        'remoteAddress must be an IP address'
      );

      connection.close();
      server.close();
    }
  );
});
