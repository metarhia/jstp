'use strict';

const jstp = {};
module.exports = jstp;

Object.assign(jstp,
  require('./lib/record-serialization'),
  require('./lib/errors'),
  require('./lib/applications')
);

jstp.RemoteProxy = require('./lib/remote-proxy');
jstp.Connection = require('./lib/connection');
jstp.Server = require('./lib/server');

jstp.net = require('./lib/net');
jstp.tls = require('./lib/tls');
jstp.ws = require('./lib/ws');
jstp.wss = require('./lib/wss');

jstp.SimpleAuthPolicy = require('./lib/simple-auth-policy');
jstp.SimpleConnectPolicy = require('./lib/simple-connect-policy');
