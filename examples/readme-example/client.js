'use strict';

const jstp = require('../..');

// Create a TCP connection to server and connect to the `testApp` application.
// Clients can have applications too for full-duplex RPC,
// but we don't need that in this example. Client is `null` in this example,
// this implies that username and password are both `null`
// here — that is, the protocol-level authentication is not leveraged in this
// example. The next argument is an array of interfaces to inspect and build
// remote proxy objects for. Remaining arguments are for
// net.connect (host and port) and last argument is a callback
// to be called on successful connection or error.
jstp.net.connectAndInspect(
  'testApp',
  null,
  ['someService'],
  3000,
  'localhost',
  handleConnect
);

function handleConnect(error, connection, app) {
  if (error) {
    console.error(`Could not connect to the server: ${error}`);
    return;
  }

  // The `app` object contains remote proxy objects for each interface that has
  // been requested which allow to use remote APIs as regular async functions.
  // Remote proxies are also `EventEmitter`s: they can be used to `.emit()`
  // events to another side of a connection and listen to them using `.on()`.
  app.someService.sayHi('JSTP', (error, message) => {
    if (error) {
      console.error(`Oops, something went wrong: ${error}`);
      return;
    }
    console.log(`Server said "${message}" 😲`);
  });
}
