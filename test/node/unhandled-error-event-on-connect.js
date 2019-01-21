'use strict';

const test = require('tap');

const jstp = require('../..');

const APP_NAME = 'APP_NAME';

const application = new jstp.Application(APP_NAME, {});
const serverConfig = { applications: [application] };

test.test('transport.connect must return connection error', test => {
  const server = jstp.net.createServer(serverConfig);
  server.listen(0, () => {
    const port = server.address().port;
    jstp.tls.connect(APP_NAME, null, port, 'localhost', error => {
      test.assert(error, 'connect must fail');
      server.close();
      test.end();
    });
  });
});
