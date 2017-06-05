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

const server = jstp.tls.createServer({ applications: [app], key, cert });

server.listen(0, () => {
  const port = server.address().port;
  jstp.tls.createConnection(app.name, null, port, (error, connection) => {
    if (error) {
      test.threw(error);
      return test.bailout();
    }

    connection.callMethod('service', 'method', [], (error, result) => {
      if (error) {
        test.threw(error);
        return test.bailout();
      }

      test.equal(result, 'ok', 'result is correct');
      connection.close();
      server.close();
      test.end();
    });
  });
});
