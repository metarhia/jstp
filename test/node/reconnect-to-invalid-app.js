'use strict';

const test = require('tap');

const jstp = require('../..');

const APP_NAME = 'APP_NAME';
const INVALID_APP_NAME = 'INVALID_APP_NAME';

const application = new jstp.Application(APP_NAME, {});
const serverConfig = { applications: [application] };

const DEFAULT_BACKOFF_TIME = 1000;
const MAX_BACKOFF_TIME = 16000;
const BACKOFF_OFFSET = 2000;
let backoff = DEFAULT_BACKOFF_TIME;
const reconnector = (connection, reconnectFn) => {
  if (connection.closedIntentionally) return;
  setTimeout(() => {
    reconnectFn((error) => {
      if (error) {
        const newBackoff = backoff * 2;
        backoff = (newBackoff < MAX_BACKOFF_TIME) ?
          newBackoff : MAX_BACKOFF_TIME;
        return;
      }
      backoff = DEFAULT_BACKOFF_TIME;
    });
  }, backoff);
};

test.test('reconnection to non-existent app must not throw', (test) => {
  const server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    jstp.net.connect(INVALID_APP_NAME, { reconnector }, port, 'localhost',
      (error, conn) => {
        test.assert(
          error, 'connection to non-existent app must return an error'
        );
        setTimeout(() => {
          conn.close();
          server.close();
          test.end();
        }, MAX_BACKOFF_TIME - BACKOFF_OFFSET);
      }
    );
  });
});
