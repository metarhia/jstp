'use strict';

const test = require('tap');

const cp = require('child_process');
const path = require('path');

const jstp = require('../..');

const APP_NAME = 'APP_NAME';

const WAITING_TIME = 14000;
const EXPECTED_ATTEMPTS_TO_RECONNECT = 4;

const server =
  cp.fork(path.join(__dirname, '../utils/reconnector/server-for-backoff.js'));

server.on('message', ([type, port]) => {
  test.plan(EXPECTED_ATTEMPTS_TO_RECONNECT + 1);

  if (type !== 'listening') {
    test.fail('must not receive unknown messages');
  }

  jstp.net.connect(APP_NAME, null, port, 'localhost', (error, connection) => {
    test.assertNot(error, 'must connect to server and perform handshake');

    connection.on('error', () => {
      // dismiss
    });

    server.kill('SIGTERM');

    connection.on('reconnectAttempt', () => {
      test.pass('must attempt to reconnect');
    });

    setTimeout(() => {
      connection.close();
    }, WAITING_TIME);
  });
});
