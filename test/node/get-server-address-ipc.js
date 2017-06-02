'use strict';

const test = require('tap');
const fs = require('fs');

const jstp = require('../..');

const app = new jstp.Application('name', {});

const path = process.platform === 'win32' ?
  '\\\\.\\pipe\\my-service' :
  '/tmp/my-service.sock';
const config = { path, applications: [app] };

const server = jstp.net.createServer(config);

let triedToUnlink = false;

server.on('close', () => {
  fs.unlink(config.path, () => {
    triedToUnlink = true;
  });
});

process.on('exit', () => {
  if (!triedToUnlink) {
    fs.unlinkSync(config.path);
  }
});

test.assertNot(server.address(),
  'must return null address if server is not listening');

server.listen(config.path, () => {
  test.strictEqual(server.address(), config.path,
    'must return correct path address upon listening');
  server.close();
});
