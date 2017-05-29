'use strict';

const test = require('tap').test;

const jstp = require('../..');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

const Transport = require('../unit/mock/transport');

test('must perform an anonymous handshake', (test) => {
  test.plan(3);

  const port = 3333;
  const server = jstp.tcp.createServer(port, [application], app.authCallback);
  server.listen(() => {
    const client = jstp.tcp.createClient({ host: 'localhost', port });

    client.connectAndHandshake(app.name, null, null, (error, connection) => {
      test.assertNot(error, 'must be no error');
      test.equal(connection.username, null, 'username must be null');
      test.equal(connection.sessionId, app.sessionId,
        'session id must be equal to the one provided by authCallback');
      client.disconnect();
      server.close();
    });
  });
});


test('must perform a handshake with credentials', (test) => {
  test.plan(3);

  const port = 3334;
  const server = jstp.tcp.createServer(port, [application], app.authCallback);
  server.listen(() => {
    const client = jstp.tcp.createClient({ host: 'localhost', port });

    client.connectAndHandshake(app.name, app.login, app.password,
      (error, connection) => {
        test.assertNot(error, 'must be no error');
        test.equal(connection.username, app.login,
          'username must be same as the one passed with handshake');
        test.equal(connection.sessionId, app.sessionId,
          'session id must be equal to the one provided by authCallback');
        client.disconnect();
        server.close();
      }
    );
  });
});

test('must not perform a handshake with invalid credentials', (test) => {
  test.plan(2);

  const port = 3335;
  const server = jstp.tcp.createServer(port, [application], app.authCallback);
  server.listen(() => {
    const client = jstp.tcp.createClient({ host: 'localhost', port });

    client.connectAndHandshake(app.name, app.login, 'psssword', (error) => {
      test.assert(error, 'must be an error');
      test.equal(error.code, jstp.ERR_AUTH_FAILED,
        'error code must be ERR_AUTH_FAILED');
      client.disconnect();
      server.close();
    });
  });
});

test('must handle inexistent application error', (test) => {
  test.plan(2);

  const port = 3336;
  const server = jstp.tcp.createServer(port, [application], app.authCallback);
  server.listen(() => {
    const client = jstp.tcp.createClient({ host: 'localhost', port });

    client.connectAndHandshake('inexistentApp', null, null, (error) => {
      test.assert(error, 'must be an error');
      test.equal(error.code, jstp.ERR_APP_NOT_FOUND,
        'error code must be ERR_APP_NOT_FOUND');
      client.disconnect();
      server.close();
    });
  });
});

test('must not accept handshakes on a client', (test) => {
  test.plan(1);

  const transport = new Transport();

  const handshake = {
    handshake: [0, app.name],
  };
  const response = {
    handshake: [0],
    error: [jstp.ERR_NOT_A_SERVER]
  };

  transport.on('dataSent', (data) => {
    test.equal(data, jstp.stringify(response));
  });

  // `connection` is being used in an implicit way
  // `connection._processHandshakeRequest` is being tested
  // eslint-disable-next-line no-unused-vars
  const connection = new jstp.Connection(transport, null, {});
  transport.emitPacket(handshake);
});
