'use strict';

const test = require('tap');

const jstp = require('../..');

const app = require('../fixtures/application');

const application = new jstp.Application(app.name, app.interfaces);
const serverConfig = {
  applications: [application],
  authPolicy: app.authCallback,
};

let server;
let port;

test.beforeEach(done => {
  server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    port = server.address().port;
    done();
  });
});

test.afterEach(done => {
  server.close();
  done();
});

test.test('must broadcast event to all connected clients', test => {
  const iface = 'someService';
  const eventName = 'broadcast';
  const eventArgs = ['hello'];

  let connectionCount = 3;

  test.plan(connectionCount * 4);

  const callback = () => {
    if (--connectionCount === 0) {
      server.broadcast(iface, eventName, ...eventArgs);
    }
  };

  for (let i = 0; i < connectionCount; i++) {
    connectAndCheckEvent(test, iface, eventName, eventArgs, callback);
  }
});

function connectAndCheckEvent(test, iface, eventName, args, callback) {
  jstp.net.connect(
    app.name,
    null,
    port,
    (error, connection) => {
      test.assertNot(error, 'must connect to server and perform handshake');
      connection.on('event', (interfaceName, remoteName, remoteArgs) => {
        test.strictEqual(interfaceName, iface, 'event interface must match');
        test.strictEqual(
          remoteName,
          eventName,
          'event name must be equal to the emitted one'
        );
        test.strictDeepEqual(
          remoteArgs,
          args,
          'event arguments must be equal to the passed ones'
        );
        connection.close();
      });
      callback();
    }
  );
}
