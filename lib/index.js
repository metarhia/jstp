'use strict';

const jstp = {};
module.exports = jstp;

Object.assign(jstp,
  require('./serde.js'),
  require('./errors'),
  require('./applications')
);

jstp.RemoteProxy = require('./remote-proxy');
jstp.Connection = require('./connection');
jstp.Server = require('./server');
jstp.Session = require('./session');

jstp.net = require('./net');
jstp.tls = require('./tls');
jstp.ws = require('./ws');
jstp.wss = require('./wss');

jstp.SimpleConnectPolicy = require('./simple-connect-policy');
jstp.SimpleSessionStorageProvider = require(
  './simple-session-storage-provider'
);
