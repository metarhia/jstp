'use strict';

const test = require('tap');

const jstp = require('../..');

const name = 'testApp';

const interfaces = {
  iface: {}
};

const app = {
  name,
  interfaces
};

const application = new jstp.Application(app.name, app.interfaces);
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
  client.disconnect();
  server.close();
  done();
});

const iface = 'iface';
const eventName = 'someEvent';
const args = ['firstArgument', 'secondArgument'];

test.test('server must process an event', (test) => {
  client.connectAndHandshake(app.name, null, null, (error, connection) => {
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
  client.connectAndHandshake(app.name, null, null, (error, connection) => {
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
  client.connectAndInspect(app.name, null, null, [iface],
    (error, connection, api) => {
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
  client.connectAndInspect(app.name, null, null, [iface],
    (error, connection, api) => {
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
