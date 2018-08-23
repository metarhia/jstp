'use strict';

const test = require('tap');

const jstp = require('../..');

const APP_NAME = 'APP_NAME';

const TOKEN = 'TOKEN';

const interfaces = {
  iface: {
    first(connection, token, callback) {
      connection.session.set(TOKEN, token);
      callback(null);
    },

    second(connection, callback) {
      callback(null, connection.session.get(TOKEN));
    },
  },
};

const application = new jstp.Application(APP_NAME, interfaces);
const serverConfig = { applications: [application] };

let server;
let connection;

test.beforeEach(done => {
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    jstp.net.connect(APP_NAME, null, port, 'localhost', (error, conn) => {
      test.assertNot(error, 'must connect to server and perform handshake');
      connection = conn;
      done();
    });
  });
});

test.afterEach(done => {
  if (connection) {
    connection.close();
    connection = null;
  }
  server.close();
  done();
});

test.test('must reconnect to the same session', test => {
  connection.callMethod('iface', 'first', [TOKEN], error => {
    test.assertNot(error, 'callMethod must not return an error');
    connection.getTransport().destroy();
    connection.on('error', () => {
      // dismiss
    });

    setTimeout(() => {
      connection.callMethod('iface', 'second', [], (error, token) => {
        test.assertNot(error, 'callMethod must not return an error');
        test.equal(token, TOKEN,
          'second method must return the same token passed to first method'
        );
        test.end();
      });
    }, 1000);
  });
});
