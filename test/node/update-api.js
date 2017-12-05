'use strict';

const test = require('tap');

const jstp = require('../..');

const oldApi = {
  name: 'oldApi',
  interfaces: {
    iface: {
      method: (connection, callback) => {
        callback(null, 42);
      },
    },
  },
};

const newApi = {
  name: 'newApi',
  interfaces: {
    iface: {
      newMethod: (connection, callback) => {
        callback(null, 420);
      },
    },
  },
};

const oldApplication = new jstp.Application(oldApi.name, oldApi.interfaces);
const newApplication = new jstp.Application(newApi.name, newApi.interfaces);

let server;

test.beforeEach((done) => {
  server = jstp.net.createServer({ applications: [oldApplication] });
  server.listen(0, done);
});

test.afterEach((done) => {
  server.close(done);
});

test.test('must update API', (test) => {
  const port = server.address().port;
  server.updateApi([newApplication]);
  jstp.net.connect(newApi.name, null, port, 'localhost',
    (error, connection) => {
      test.assertNot(error, 'must connect to a new application');
      connection.callMethod('iface', 'newMethod', [], (error, result) => {
        test.assertNot(error, 'must call a new method');
        test.equal(result, 420);
        connection.close();
        test.end();
      });
    }
  );
});
