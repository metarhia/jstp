'use strict';

const net = require('net');

const test = require('tap');

const jstp = require('../..');

test.test(
  'handshake must return error when connection is closed before handshake',
  test => {
    const server = net.createServer(socket => {
      socket.destroy();
    });
    server.listen(0, () => {
      const port = server.address().port;
      jstp.net.connect(
        'APP_NAME', null, port, 'localhost', error => {
          if (error instanceof jstp.RemoteError) {
            test.strictSame(error.code, jstp.ERR_NO_HANDSHAKE_RESPONSE);
          } else {
            test.assert(error);
          }
          server.close();
          test.end();
        }
      );
    });
  }
);
