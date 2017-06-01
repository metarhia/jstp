'use strict';

const test = require('tap');

const jstp = require('../..');

const name = 'testApp';

const app = {
  name,
  interfaces: {}
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

test.test('client must process an event', (test) => {
  test.plan(2);

  client.connectAndHandshake(app.name, null, null, (error, connection) => {
    test.assertNot(error, 'must be no error');

    const iface = 'someInterface';
    const eventName = 'someEvent';
    const args = ['firstArgument', 'secondArgument'];

    connection.on('event', (event) => {
      if (event.remoteEventName === eventName) {
        test.strictDeepEqual(event.remoteEventArgs, args);
      } else {
        test.fail(`unexpected event: ${event.remoteEventName}`);
      }
    });

    server.getClients()[0].emitRemoteEvent(iface, eventName, args);
  });
});
