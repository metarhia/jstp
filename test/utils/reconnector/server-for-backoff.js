'use strict';

const jstp = require('../../..');

const APP_NAME = 'APP_NAME';
const INTERFACES = {};

const application = new jstp.Application(APP_NAME, INTERFACES);
const serverConfig = { applications: [application] };
const server = jstp.net.createServer(serverConfig);

server.listen(0, () => {
  process.send(['listening', server.address().port]);
});
