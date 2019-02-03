'use strict';

const test = require('tap');

const jstp = require('../..');

const APP_NAME = 'APP_NAME';

const reconnector = (connection, reconnectFn) => {
  if (!connection.closedIntentionally) {
    // Explicit transport passing is the main purpose of this test
    reconnectFn('net');
  }
};

const application = new jstp.Application(APP_NAME, {});
const serverConfig = { applications: [application] };
const server = jstp.net.createServer(serverConfig);

server.listen(0, () => {
  const port = server.address().port;
  jstp.net.connect(
    APP_NAME,
    { reconnector },
    port,
    'localhost',
    (error, connection) => {
      test.error(error, 'must connect to server and perform handshake');

      connection.getTransport().destroy();
      connection.on('error', () => {
        // dismiss
      });

      connection.on('reconnect', () => {
        test.pass('must successfully reconnect using specified transport');
        server.close();
        connection.close();
        test.end();
      });
    }
  );
});
