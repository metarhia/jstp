'use strict';

const test = require('tap');

const jstp = require('../..');

const TIMEOUT = 5000;

const APP_NAME = 'APP_NAME';
const INVALID_APP_NAME = 'INVALID_APP_NAME';

const application = new jstp.Application(APP_NAME, {});
const serverConfig = { applications: [application] };

test.test('must not reconnect after failed connection', test => {
  let reconnectionAttempts = 0;
  const reconnector = () => {
    reconnectionAttempts++;
  };
  jstp.net.connect(APP_NAME, { reconnector }, 0, '__invalid_host__', error => {
    test.assert(error, 'must fail handshake');
  });
  setTimeout(() => {
    test.strictSame(reconnectionAttempts, 0);
    test.end();
  }, TIMEOUT);
});

test.test('must not reconnect after failed handshake', test => {
  let connectionAttempts = 0;
  const server = jstp.net.createServer(serverConfig);
  server.on('connection', () => {
    connectionAttempts++;
  });
  server.listen(0, () => {
    const port = server.address().port;
    jstp.net.connect(INVALID_APP_NAME, null, port, 'localhost', error => {
      test.strictSame(
        error.code,
        jstp.ERR_APP_NOT_FOUND,
        'must fail handshake'
      );
    });
  });
  setTimeout(() => {
    test.strictSame(connectionAttempts, 1);
    server.close();
    test.end();
  }, TIMEOUT);
});
