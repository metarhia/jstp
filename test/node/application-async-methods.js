'use strict';

const test = require('tap');

const jstp = require('../..');

const app = require('../fixtures/application');

const application = new jstp.Application(app.name, {
  someInterface: {
    getSessionId: async connection => connection.session.id,
    sum: async (connection, a, b) => a + b,
  },
});
const server = jstp.net.createServer([application]);

test.test('application must support async methods', test => {
  server.listen(0, () => {
    const port = server.address().port;
    jstp.net.connect(app.name, null, port, (error, connection) => {
      test.plan(5);
      test.error(error);
      test.tearDown(() => {
        connection.close();
        server.close();
      });
      connection.callMethod(
        'someInterface',
        'getSessionId',
        [],
        (err, value) => {
          test.error(err);
          test.equal(value, connection.session.id);
        }
      );
      connection.callMethod('someInterface', 'sum', [1, 2], (err, value) => {
        test.error(err);
        test.equal(value, 3);
      });
    });
  });
});
