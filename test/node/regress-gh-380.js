// Regression test for https://github.com/metarhia/jstp/pull/329

'use strict';

const test = require('tap');
const { client: WebSocketClient } = require('websocket');

const jstp = require('../..');

const app = new jstp.Application('app', {});

const makeTest = protocols => test => {
  const server = jstp.ws.createServer([app]);

  test.tearDown(() => {
    server.close();
  });

  server.listen(0, () => {
    const client = new WebSocketClient();
    const url = `ws://localhost:${server.address().port}`;

    client.once('connect', connection => {
      connection.close();
      test.fail('unreachable code: WS protocol negotiation is probably broken');
      test.end();
    });

    client.once('connectFailed', () => {
      test.end();
    });

    client.connect(
      url,
      protocols
    );
  });
};

test.plan(2);

test.test('must not crash with empty list of protocols', makeTest(null));
test.test('must not crash with unsupported protocols', makeTest(['a', 'b']));
