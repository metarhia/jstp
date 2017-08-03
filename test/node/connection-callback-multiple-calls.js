'use strict';

const tap = require('tap');
const jstp = require('../..');

const app = new jstp.Application('app', {});
const server = jstp.net.createServer({ applications: [app] });

tap.plan(1);

server.listen(0, () => {
  const port = server.address().port;
  jstp.net.connect(app.name, null, port, (error, connection) => {
    tap.pass('must call callback once');
    connection.getTransport().destroy();
    connection.on('error', () => {
      // dismiss
    });
    connection.emitRemoteEvent('someService', 'someEvent', []);
    server.close();
  });
});
