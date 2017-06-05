'use strict';

const test = require('tap');

const jstp = require('../..');

const app = new jstp.Application('name', {});

const server = jstp.ws.createServer([app]);

test.assertNot(server.address(),
  'must return null address if server is not listening');

server.listen(() => {
  const port = server.address().port;
  test.ok(port > 0 && port < 65536,
    'must return correct port number upon listening');
  server.close();
});
