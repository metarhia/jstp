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
  <a href="https://badge.fury.io/js/%40metarhia%2Fjstp"><img
    src="https://badge.fury.io/js/%40metarhia%2Fjstp.svg"
    alt="NPM Version"
  /></a>
  <a href="https://www.npmjs.com/package/@metarhia/jstp"><img
    src="https://img.shields.io/npm/dm/@metarhia/jstp.svg"
    alt="NPM Downloads/Month"
  /></a>
  <a href="https://www.npmjs.com/package/@metarhia/jstp"><img
    src="https://img.shields.io/npm/dt/@metarhia/jstp.svg"
    alt="NPM Downloads"
  /></a>
  <h1>JSTP / JavaScript传输协议</h1>
</div>


JSTP是一个提供双向异步数据的RPC协议和框架，支持多个并行传输的非阻塞交互，他是如此透明，应用程序甚至可能不区分本地异步函数和远程过程。

另外，它还附带了一个非常快的[JSON5](https://github.com/json5)功能!


**这个项目受行为[准则](CODE_OF_CONDUCT.md)的约束**



## 安装

JSTP是基于Node.js和web浏览器工作的:
```sh
$ npm install --save @metarhia/jstp
```
或者，使用UMD包 [jstp.umd.js](https://unpkg.com/@metarhia/jstp@latest/dist/jstp.umd.js)

我们还有针对[Swift](https://github.com/metarhia/jstp-swift)和[Java](https://github.com/metarhia/jstp-java)的官方客户端实现，可以轻松地在iOS和Android tada上运行🎉

我们提供了一个命令行工具jstp-cli：

```sh
$ npm install -g @metarhia/jstp
$ jstp-cli
```

## 入门指南

Server:

```js
'use strict';

const jstp = require('@metarhia/jstp');

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

const jstp = require('@metarhia/jstp');

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

## 项目维护者

感谢 [@tshemsedinov](https://github.com/tshemsedinov) 提供的初始想法和概念验证实现。目前项目团队为:

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
