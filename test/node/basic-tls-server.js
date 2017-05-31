'use strict';

const fs = require('fs');
const path = require('path');
const test = require('tap');
const jstp = require('../..');

// Prevent Node.js from throwing DEPTH_ZERO_SELF_SIGNED_CERT.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const key = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/cert/test.key'));
const cert = fs.readFileSync(
  path.resolve(__dirname, '../fixtures/cert/test.crt'));

const app = new jstp.Application('app', {
  service: {
    method(connection, callback) {
      callback(null, 'ok');
    }
  }
});

// TODO(aqrln): change the port to 0 once server.address() API is landed
// on master.
const PORT = 4000;

const server = jstp.tcp.createServer({ port: PORT, key, cert }, [app]);

server.listen(() => {
  const client = jstp.tcp.createClient({
    host: 'localhost',
    port: PORT,
    secure: true
  });

  client.connectAndHandshake('app', null, null, (error, connection) => {
    if (error) {
      test.threw(error);
      test.bailout();
    }

    connection.callMethod('service', 'method', [], (error, result) => {
      if (error) {
        test.threw(error);
        test.bailout();
      }

      test.equal(result, 'ok', 'result is correct');
      connection.close();
      server.close();
      test.end();
    });
  });
});
