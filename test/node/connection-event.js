'use strict';

const test = require('tap');

const jstp = require('../..');

const name = 'testApp';

const interfaces = {
  iface: {},
};

const app = {
  name,
  interfaces,
};

const application = new jstp.Application(app.name, app.interfaces);

let server;
let connection;

test.beforeEach((done) => {
  server = jstp.net.createServer([application]);
  server.listen(0, () => done());
});

test.afterEach((done) => {
  if (connection) {
    connection.close();
    connection = null;
  }
  server.close();
  done();
});

const iface = 'iface';
const eventName = 'someEvent';
const args = ['firstArgument', 'secondArgument'];

test.test('server must process an event', (test) => {
  const port = server.address().port;
  jstp.net.connect(app.name, null, port, (error, conn) => {
    connection = conn;
    test.assertNot(error, 'must connect to server');

    server.getClients()[0].on('event',
      (interfaceName, remoteName, remoteArgs) => {
        test.strictEqual(interfaceName, iface,
          'event interface must match');
        test.strictEqual(remoteName, eventName,
          'event name must be equal to the emitted one');
        test.strictDeepEqual(remoteArgs, args,
          'event arguments must be equal to the passed ones');

        test.end();
      });

    connection.emitRemoteEvent(iface, eventName, args);
  });
});

test.test('client must process an event', (test) => {
  const port = server.address().port;
  jstp.net.connect(app.name, null, port, (error, conn) => {
    connection = conn;
    test.assertNot(error, 'must connect to server');

    connection.on('event', (interfaceName, remoteName, remoteArgs) => {
      test.strictEqual(interfaceName, iface,
        'event interface must match');
      test.strictEqual(remoteName, eventName,
        'event name must be equal to the emitted one');
      test.strictDeepEqual(remoteArgs, args,
        'event arguments must be equal to the passed ones');
      test.end();
    });

    server.getClients()[0].emitRemoteEvent(iface, eventName, args);
  });
});

test.test('remote proxy must emit an event', (test) => {
  const port = server.address().port;
  jstp.net.connectAndInspect(app.name, null, [iface], port,
    (error, conn, api) => {
      connection = conn;
      test.assertNot(error, 'must connect to server');

      server.getClients()[0].on('event',
        (interfaceName, remoteName, remoteArgs) => {
          test.strictEqual(interfaceName, iface,
            'event interface must match');
          test.strictEqual(remoteName, eventName,
            'event name must be equal to the emitted one');
          test.strictDeepEqual(remoteArgs, args,
            'event arguments must be equal to the passed ones');
          test.end();
        });

      api.iface.emit(eventName, ...args);
    }
  );
});

test.test('remote proxy must process an event', (test) => {
  const port = server.address().port;
  jstp.net.connectAndInspect(app.name, null, [iface], port,
    (error, conn, api) => {
      connection = conn;
      test.assertNot(error, 'must connect to server');

      api.iface.on(eventName, (...eventArgs) => {
        test.strictDeepEqual(eventArgs, args,
          'event arguments must be equal to the passed ones');
        test.end();
      });
      server.getClients()[0].emitRemoteEvent(iface, eventName, args);
    }
  );
});
