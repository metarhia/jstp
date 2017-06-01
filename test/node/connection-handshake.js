'use strict';

const test = require('tap');

const jstp = require('../..');

const app = require('../fixtures/application');
const application = new jstp.Application(app.name, app.interfaces);

const Transport = require('../unit/mock/transport');

let server;
let client;

test.beforeEach((done) => {
  server = jstp.tcp.createServer(0, [application], app.authCallback);
  server.listen(() => {
    const port = server.address().port;
    client = jstp.tcp.createClient({ host: 'localhost', port });
    done();
  });
});

test.afterEach((done) => {
  if (client.connection) {
    client.disconnect();
  }
  server.close();
  done();
});

test.test('must perform a handshake', (test) => {
  client.connect((error, connection) => {
    test.assertNot(error, 'must connect to server');
    connection.handshake(app.name, null, null, (error, sessionId) => {
      test.assertNot(error, 'handshake must not return an error');
      test.equal(connection.username, null, 'username must be null');
      test.equal(sessionId, app.sessionId,
        'session id must be equal to the one provided by authCallback');
      test.end();
    });
  });
});

test.test('must perform an anonymous handshake', (test) => {
  client.connectAndHandshake(app.name, null, null, (error, connection) => {
    test.assertNot(error, 'handshake must not return an error');
    test.equal(connection.username, null, 'username must be null');
    test.equal(connection.sessionId, app.sessionId,
      'session id must be equal to the one provided by authCallback');
    test.end();
  });
});


test.test('must perform a handshake with credentials', (test) => {
  client.connectAndHandshake(app.name, app.login, app.password,
    (error, connection) => {
      test.assertNot(error, 'handshake must not return an error');
      test.equal(connection.username, app.login,
        'username must be same as the one passed with handshake');
      test.equal(connection.sessionId, app.sessionId,
        'session id must be equal to the one provided by authCallback');
      test.end();
    }
  );
});

test.test('must not perform a handshake with invalid credentials', (test) => {
  client.connectAndHandshake(app.name, app.login, '__incorrect__', (error) => {
    test.assert(error, 'handshake must return an error');
    test.equal(error.code, jstp.ERR_AUTH_FAILED,
      'error code must be ERR_AUTH_FAILED');
    test.end();
  });
});

test.test('must handle nonexistent application error', (test) => {
  client.connectAndHandshake('nonexistentApp', null, null, (error) => {
    test.assert(error, 'handshake must return an error');
    test.equal(error.code, jstp.ERR_APP_NOT_FOUND,
      'error code must be ERR_APP_NOT_FOUND');
    test.end();
  });
});

test.test('must not accept handshakes on a client', (test) => {
  const transport = new Transport();

  const handshake = {
    handshake: [0, app.name],
  };
  const response = {
    handshake: [0],
    error: [jstp.ERR_NOT_A_SERVER]
  };

  transport.on('dataSent', (data) => {
    test.equal(data, jstp.stringify(response),
      'client must return ERR_NOT_A_SERVER');
    test.end();
  });

  // `connection` is being used in an implicit way
  // `connection._processHandshakeRequest` is being tested
  // eslint-disable-next-line no-unused-vars
  const connection = new jstp.Connection(transport, null, {});
  transport.emitPacket(handshake);
});
