// Regression test for https://github.com/metarhia/jstp/pull/329

'use strict';

const test = require('tap');
const jstp = require('../..');

const app = new jstp.Application('app', {});
const server = jstp.net.createServer([app]);

server.on('log', (connection, event) => {
  if (event === 'inspect') {
    test.fail('must not send inspect message');
  }
});

test.plan(4);

server.listen(0, () => {
  jstp.net.connectAndInspect(
    app.name,
    null,
    [],
    server.address().port,
    (error, connection, api) => {
      test.pass('must invoke the callback');
      test.assertNot(error, 'must connect to server');
      test.equal(
        Object.keys(connection.remoteProxies).length,
        0,
        'no remote proxy instances must be created'
      );
      test.equal(
        Object.keys(api).length,
        0,
        'no remote proxy instances must be passed to callback'
      );
      connection.close();
      server.close();
    }
  );
});
