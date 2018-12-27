<!-- lint ignore -->
<div align="center">
  <a href="https://github.com/metarhia/jstp"><img
    src="https://cdn.rawgit.com/metarhia/Metarhia/master/Logos/metarhia-logo.svg"
    alt="Metarhia Logo"
    width="300"
  /></a>
  <h1>JSTP / JavaScript Transfer Protocol</h1>
</div>

JSTP is an RPC protocol and framework which provides two-way asynchronous data
transfer with support of multiple parallel non-blocking interactions that is so
transparent that an app may not even distinguish between local async functions
and remote procedures.

## Installation

JSTP works in Node.js and web browsers:

```sh
$ npm install --save @metarhia/jstp
```

Or, alternatively, there is
[jstp.umd.js](https://unpkg.com/@metarhia/jstp@latest/dist/jstp.umd.js)
UMD bundle.

We also have official client-side implementations for
[Swift](https://github.com/metarhia/jstp-swift) and
[Java](https://github.com/metarhia/jstp-java)
that work effortlessly on iOS and Android 🎉

There is also an interactive CLI provided by this package:

```sh
$ npm install -g @metarhia/jstp
$ jstp-cli
```
