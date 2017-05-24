'use strict';

const test = require('tap').test;

const jstp = require('../..');

const Transport = require('../unit/mock/transport');

test('must not accept handshakes on a client', (test) => {
  test.plan(1);

  const transport = new Transport();

  const handshake = {
    handshake: [0, 'App'],
  };
  const response = {
    handshake: [0],
    error: [jstp.ERR_NOT_A_SERVER]
  };

  transport.on('dataSent', (data) => {
    test.equal(data, jstp.stringify(response));
  });

  // `connection` is being used in an implicit way
  // `connection._processHandshakeRequest` is being tested
  // eslint-disable-next-line no-unused-vars
  const connection = new jstp.Connection(transport, null, {});
  transport.emitPacket(handshake);
});
