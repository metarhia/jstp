'use strict';

const jstp = require('../..');

// Application is the core high-level abstraction of the framework. An app
// consists of a number of interfaces, and each interface has its methods.
const app = new jstp.Application('testApp', {
  someService: {
    sayHi(connection, name, callback) {
      callback(null, `Hi, ${name}!`);
    }
  }
});

// Let's create a TCP server for this app. Other available transports are
// WebSocket and Unix domain sockets. One might notice that an array of
// applications is passed the `createServer()`. That's because it can serve
// any number of applications.
const server = jstp.tcp.createServer(3000, [app]);
server.listen(() => {
  console.log('TCP server listening on port 3000 🚀');
});
