<!-- lint ignore -->
<div align="center">
  <a href="https://github.com/metarhia/jstp"><img
    src="https://cdn.rawgit.com/metarhia/Metarhia/master/Logos/metarhia-logo.svg"
    alt="Metarhia Logo"
    width="300"
  /></a>
  <br />
  <br />
  <a href="https://travis-ci.org/metarhia/jstp"><img
    src="https://travis-ci.org/metarhia/jstp.svg?branch=master"
    alt="Travis CI"
  /></a>
  <a href="https://ci.appveyor.com/project/metarhia/jstp"><img
    src="https://ci.appveyor.com/api/projects/status/rev863t5a909ltuq/branch/master?svg=true"
    alt="AppVeyor CI"
  /></a>
  <a href="https://coveralls.io/github/metarhia/jstp?branch=master"><img
    src="https://coveralls.io/repos/github/metarhia/jstp/badge.svg?branch=master"
    alt="Coverage Status"
  /></a>
  <a href="https://badge.fury.io/js/metarhia-jstp"><img
    src="https://badge.fury.io/js/metarhia-jstp.svg"
    alt="NPM Version"
  /></a>
  <a href="https://www.npmjs.com/package/metarhia-jstp"><img
    src="https://img.shields.io/npm/dm/metarhia-jstp.svg"
    alt="NPM Downloads/Month"
  /></a>
  <a href="https://www.npmjs.com/package/metarhia-jstp"><img
    src="https://img.shields.io/npm/dt/metarhia-jstp.svg"
    alt="NPM Downloads"
  /></a>
  <h1>JSTP / JavaScript Transfer Protocol</h1>
</div>

JSTP is an RPC protocol and framework which provides two-way asynchronous data
transfer with support of multiple parallel non-blocking interactions that is so
transparent that an app may not even distinguish between local async functions
and remote procedures.

And, as a nice bonus, there's a blazing fast [JSON5](https://github.com/json5)
implementation bundled in!

**This project is bound by a [Code of Conduct](CODE_OF_CONDUCT.md).**

## Installation

JSTP works in Node.js and web browsers:

```sh
$ npm install --save metarhia-jstp
```

Or, alternatively, there is
[jstp.umd.js](https://unpkg.com/metarhia-jstp@latest/dist/jstp.umd.js)
UMD bundle.

We also have official client-side implementations for
[Swift](https://github.com/metarhia/jstp-swift) and
[Java](https://github.com/metarhia/jstp-java)
that work effortlessly on iOS and Android 🎉

## Getting Started

Server:

```js
'use strict';

const jstp = require('metarhia-jstp');

// Application is the core high-level abstraction of the framework. An app
// consists of a number of interfaces, and each interface has its methods.
const app = new jstp.Application('testApp', {
  someService: {
    sayHi(connection, name, callback) {
      callback(null, `Hi, ${name}!`);
    },
  },
});

// Let's create a TCP server for this app. Other available transports are
// WebSocket and Unix domain sockets. One might notice that an array of
// applications is passed the `createServer()`. That's because it can serve
// any number of applications.
const server = jstp.net.createServer([app]);
server.listen(3000, () => {
  console.log('TCP server listening on port 3000 🚀');
});
```

Client:

```js
'use strict';

const jstp = require('metarhia-jstp');

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
```

## Project Maintainers

Kudos to [@tshemsedinov](https://github.com/tshemsedinov) for the initial idea
and proof-of-concept implementation. Current project team is:

- [@aqrln](https://github.com/aqrln) &mdash;
  **Alexey Orlenko** &lt;eaglexrlnk@gmail.com&gt;
- [@belochub](https://github.com/belochub) &mdash;
  **Mykola Bilochub** &lt;nbelochub@gmail.com&gt;
- [@lundibundi](https://github.com/lundibundi) &mdash;
  **Denys Otrishko** &lt;shishugi@gmail.com&gt;
- [@nechaido](https://github.com/nechaido) &mdash;
  **Dmytro Nechai** &lt;nechaido@gmail.com&gt;
- [@tshemsedinov](https://github.com/tshemsedinov) &mdash;
  **Timur Shemsedinov** &lt;timur.shemsedinov@gmail.com&gt;
