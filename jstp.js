'use strict';

const jstp = {};
module.exports = jstp;

Object.assign(jstp,
  require('./lib/serde.js'),
  require('./lib/errors'),
  require('./lib/applications')
);

jstp.RemoteProxy = require('./lib/remote-proxy');
jstp.Connection = require('./lib/connection');
jstp.Server = require('./lib/server');
jstp.Session = require('./lib/session');

jstp.net = require('./lib/net');
jstp.tls = require('./lib/tls');
jstp.ws = require('./lib/ws');
jstp.wss = require('./lib/wss');

jstp.SimpleConnectPolicy = require('./lib/simple-connect-policy');
jstp.SimpleSessionStorageProvider = require(
  './lib/simple-session-storage-provider'
);
