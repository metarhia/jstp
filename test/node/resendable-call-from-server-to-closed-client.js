'use strict';

const test = require('tap');

const jstp = require('../..');

const appName = 'application';
const interfaces = {
  iface: {
    method: (connection, callback) => {
      callback(null);
    },
  },
};

const application = new jstp.Application(appName, interfaces);
const serverConfig = { applications: [application] };
const server = jstp.net.createServer(serverConfig);

const client = {
  session: null,
  application: new jstp.Application(appName, interfaces),
  reconnector: () => {},
};

server.listen(0, () => {
  const port = server.address().port;
  jstp.net.connect(appName, client, port, 'localhost', (error, connection) => {
    test.assertNot(error, 'must connect to server');

    const serverConnection = server.getClientsArray()[0];

    connection.close();
    serverConnection.callMethodWithResend('iface', 'method', [], error => {
      test.assertNot(error, 'must not return an error');
      connection.close();
      server.close();
      test.end();
    });

    const port = server.address().port;
    client.session = connection.session;

    jstp.net.reconnect(connection, port, 'localhost', (error, conn) => {
      test.assertNot(error, 'must reconnect to server');
      connection = conn;
    });
  });
});
