'use strict';

const chai = require('chai');
const chaiSpies = require('chai-spies');

const jstp = require('../..');

const constants = require('./constants');
const applicationMock = require('./mock/application');
const TransportMock = require('./mock/transport');
const ServerMock = require('./mock/server');
const ClientMock = require('./mock/client');

const expect = chai.expect;
chai.use(chaiSpies);

describe('JSTP Connection', () => {
  let serverTransportMock;
  let clientTransportMock;
  let serverMock;
  let clientMock;
  let serverConnection;
  let clientConnection;

  function performHandshakeFromClient(callback) {
    clientConnection.handshake(constants.TEST_APPLICATION,
      null, null, callback);

    clientTransportMock.emitPacket({
      handshake: [0],
      ok: constants.TEST_SESSION_ID
    });
  }

  function emulateHandshakeOnServer() {
    serverTransportMock.emitPacket({
      handshake: [0, constants.TEST_APPLICATION]
    });
  }

  function testPacketSending(packetType, test) {
    const description = 'must send ' + packetType + ' packets';

    it(description + ' (client)', () => {
      performHandshakeFromClient(() => {
        test(clientConnection, clientTransportMock);
      });
    });

    it(description + ' (server)', () => {
      emulateHandshakeOnServer();
      test(serverConnection, serverTransportMock);
    });
  }

  beforeEach(() => {
    clientTransportMock = new TransportMock();
    serverTransportMock = new TransportMock();

    serverMock = new ServerMock();
    clientMock = new ClientMock();

    serverConnection = new jstp.Connection(serverTransportMock, serverMock);
    clientConnection =
      new jstp.Connection(clientTransportMock, null, clientMock);
  });

  describe('handshake', () => {
    it('must send anonymous handshake from a client', () => {
      chai.spy.on(clientTransportMock, 'send');

      const callback = chai.spy((error, sessionId) => {
        expect(error).to.not.exist;
        expect(sessionId).to.equal(constants.TEST_SESSION_ID);

        expect(clientConnection.username).to.be.null;
        expect(clientConnection.handshakeDone).to.be.true;

        clientTransportMock.send.reset();
      });

      clientConnection.handshake(constants.TEST_APPLICATION,
        null, null, callback);

      expect(clientTransportMock.send)
        .to.be.called.with(jstp.stringify({
          handshake: [0, constants.TEST_APPLICATION]
        }));

      clientTransportMock.emitPacket({
        handshake: [0],
        ok: constants.TEST_SESSION_ID
      });

      expect(callback).to.be.called();
    });

    it('must send authenticated handshake from a client', () => {
      chai.spy.on(clientTransportMock, 'send');

      const callback = chai.spy((error, sessionId) => {
        expect(error).to.not.exist;
        expect(sessionId).to.equal(constants.TEST_SESSION_ID);

        expect(clientConnection.username).to.eql(constants.TEST_USERNAME);
        expect(clientConnection.handshakeDone).to.be.true;

        clientTransportMock.send.reset();
      });

      clientConnection.handshake(constants.TEST_APPLICATION,
        constants.TEST_USERNAME, constants.TEST_PASSWORD, callback);

      const handshakeRequest = {
        handshake: [0, constants.TEST_APPLICATION],
        login: [constants.TEST_USERNAME, constants.TEST_PASSWORD]
      };

      expect(clientTransportMock.send)
        .to.be.called.with(jstp.stringify(handshakeRequest));

      clientTransportMock.emitPacket({
        handshake: [0],
        ok: constants.TEST_SESSION_ID
      });

      expect(callback).to.be.called();
    });

    it('must handle inexistent application error', () => {
      const callback = chai.spy((error, sessionId) => {
        expect(error.code).to.equal(jstp.ERR_APP_NOT_FOUND);
        expect(sessionId).to.not.exist;

        expect(clientConnection.username).to.be.null;
        expect(clientConnection.handshakeDone).to.be.false;
      });

      clientConnection.handshake('invalidApp', 'user', 'password', callback);
      clientTransportMock.emitPacket({
        handshake: [0],
        error: [jstp.ERR_APP_NOT_FOUND]
      });

      expect(callback).to.be.called();
    });

    it('must handle authentication error', () => {
      const callback = chai.spy((error, sessionId) => {
        expect(error.code).to.equal(jstp.ERR_AUTH_FAILED);
        expect(sessionId).to.not.exist;

        expect(clientConnection.username).to.be.null;
        expect(clientConnection.handshakeDone).to.be.false;
      });

      clientConnection.handshake(constants.TEST_APPLICATION,
        constants.TEST_USERNAME, constants.TEST_PASSWORD, callback);

      clientTransportMock.emitPacket({
        handshake: [0],
        error: [jstp.ERR_AUTH_FAILED]
      });

      expect(callback).to.be.called();
    });

    it('must process anonymous handshake packets on server', () => {
      const sendSpy = chai.spy.on(serverTransportMock, 'send');
      const startSessionSpy = chai.spy.on(serverMock, 'startSession');

      serverTransportMock.emitPacket({
        handshake: [0, constants.TEST_APPLICATION]
      });

      expect(sendSpy).to.have.been.called.with(jstp.stringify({
        handshake: [0],
        ok: constants.TEST_SESSION_ID
      }));

      expect(startSessionSpy).to.have.been.called.with(
        serverConnection, applicationMock);

      sendSpy.reset();
      startSessionSpy.reset();
    });

    it('must process authenticated handshake packets on a server', () => {
      const sendSpy = chai.spy.on(serverTransportMock, 'send');
      const startSessionSpy =
        chai.spy.on(serverMock, 'startSession');

      const packet = {
        handshake: [0, constants.TEST_APPLICATION],
        login: [constants.TEST_USERNAME, constants.TEST_PASSWORD]
      };

      serverTransportMock.emitPacket(packet);

      expect(sendSpy).to.have.been.called.with(jstp.stringify({
        handshake: [0],
        ok: constants.TEST_SESSION_ID
      }));

      expect(startSessionSpy).to.have.been.called.with(
        serverConnection, applicationMock, 'login',
        [constants.TEST_USERNAME, constants.TEST_PASSWORD]);

      sendSpy.reset();
      startSessionSpy.reset();
    });

    it('must process handshake packets with invalid credentials', () => {
      const sendSpy = chai.spy.on(serverTransportMock, 'end');
      const startSessionSpy =
        chai.spy.on(serverMock, 'startSession');

      const password = 'illegal password';
      const packet = {
        handshake: [0, constants.TEST_APPLICATION],
        login: [constants.TEST_USERNAME, password]
      };

      serverTransportMock.emitPacket(packet);

      expect(sendSpy).to.have.been.called.with(jstp.stringify({
        handshake: [0],
        error: [jstp.ERR_AUTH_FAILED]
      }));

      expect(startSessionSpy).to.have.been.called.with(
        serverConnection, applicationMock, 'login',
        [constants.TEST_USERNAME, password]);

      sendSpy.reset();
      startSessionSpy.reset();
    });

    it('must not process handshakes on a client', () => {
      const sendSpy = chai.spy.on(clientTransportMock, 'send');

      const packet = {
        handshake: [0, constants.TEST_APPLICATION],
      };

      clientTransportMock.emitPacket(packet);

      expect(sendSpy).to.have.been.called.with(jstp.stringify({
        handshake: [0],
        error: [jstp.ERR_NOT_A_SERVER]
      }));

      sendSpy.reset();
    });
  });

  describe('inspect', () => {
    const methods = Object.keys(applicationMock).
      filter(key => key.startsWith('method'));

    testPacketSending('inspect', (connection, transport) => {
      let packetId;

      const sendSpy = chai.spy((data) => {
        const packet = jstp.parse(data);

        expect(packet).to.have.all.keys(['inspect']);
        expect(packet.inspect).to.be.an('array');

        packetId = packet.inspect[0];
        expect(packet.inspect[1]).to.equal(constants.TEST_INTERFACE);
      });

      const callback = chai.spy((error, proxy) => {
        expect(error).to.not.exist;
        expect(proxy).to.be.an.instanceof(jstp.RemoteProxy);
      });

      transport.on('dataSent', sendSpy);

      connection.inspectInterface(constants.TEST_INTERFACE, callback);
      expect(sendSpy).to.have.been.called();

      transport.emitPacket({
        callback: [packetId],
        ok: methods
      });

      expect(callback).to.have.been.called();
    });

    it('must process inspect packets', () => {
      emulateHandshakeOnServer();

      const sendSpy = chai.spy.on(serverTransportMock, 'send');

      serverTransportMock.emitPacket({
        inspect: [1, constants.TEST_INTERFACE]
      });

      expect(sendSpy).to.be.called.with(jstp.stringify({
        callback: [1],
        ok: methods
      }));

      sendSpy.reset();
    });

    it('must return an error when interface does not exist', () => {
      emulateHandshakeOnServer();

      const sendSpy = chai.spy.on(serverTransportMock, 'send');

      serverTransportMock.emitPacket({
        inspect: [1, 'no interface like that']
      });

      expect(sendSpy).to.be.called.with(jstp.stringify({
        callback: [1],
        error: [jstp.ERR_INTERFACE_NOT_FOUND]
      }));

      sendSpy.reset();
    });
  });

  describe('call', () => {
    testPacketSending('call', (connection, transport) => {
      let packetId;

      const sendSpy = chai.spy((data) => {
        const packet = jstp.parse(data);

        expect(packet).to.have.all.keys(['call', 'method1']);
        expect(packet.call).to.be.an('array');

        packetId = packet.call[0];
        expect(packet.call[1]).to.equal(constants.TEST_INTERFACE);
      });

      const callback = chai.spy((error, result) => {
        expect(error).to.not.exist;
        expect(result).to.equal(42);
      });

      transport.on('dataSent', sendSpy);

      connection.callMethod(constants.TEST_INTERFACE, 'method1', [], callback);
      expect(sendSpy).to.have.been.called();

      transport.emitPacket({
        callback: [packetId],
        ok: [42]
      });

      expect(callback).to.have.been.called();
    });

    it('must process a method call with no arguments and result', () => {
      emulateHandshakeOnServer();

      const sendSpy = chai.spy.on(serverTransportMock, 'send');

      serverTransportMock.emitPacket({
        call: [1, constants.TEST_INTERFACE],
        method1: []
      });

      expect(sendSpy).to.be.called.with(jstp.stringify({
        callback: [1],
        ok: []
      }));

      sendSpy.reset();
    });

    it('must process a method call with arguments and a result', () => {
      emulateHandshakeOnServer();

      const sendSpy = chai.spy.on(serverTransportMock, 'send');

      serverTransportMock.emitPacket({
        call: [1, constants.TEST_INTERFACE],
        method2: [10, 20]
      });

      expect(sendSpy).to.be.called.with(jstp.stringify({
        callback: [1],
        ok: [30]
      }));

      sendSpy.reset();
    });

    it('must process a method call that returns an error', () => {
      emulateHandshakeOnServer();

      const sendSpy = chai.spy.on(serverTransportMock, 'send');

      serverTransportMock.emitPacket({
        call: [1, constants.TEST_INTERFACE],
        method3: []
      });

      expect(sendSpy).to.be.called.with(jstp.stringify({
        callback: [1],
        error: [1, 'Error: Example error']
      }));

      sendSpy.reset();
    });

    it('must process a method that throws an error', () => {
      emulateHandshakeOnServer();

      const sendSpy = chai.spy.on(serverTransportMock, 'send');

      expect(() => {
        serverTransportMock.emitPacket({
          call: [1, constants.TEST_INTERFACE],
          method4: []
        });
      }).to.throw();

      expect(sendSpy).to.be.called.with(jstp.stringify({
        callback: [1],
        error: [jstp.ERR_INTERNAL_API_ERROR]
      }));

      sendSpy.reset();
    });

    it('must return an error when an interface does not exist', () => {
      emulateHandshakeOnServer();

      const sendSpy = chai.spy.on(serverTransportMock, 'send');

      serverTransportMock.emitPacket({
        call: [1, 'dummy interface'],
        method1: []
      });

      expect(sendSpy).to.be.called.with(jstp.stringify({
        callback: [1],
        error: [jstp.ERR_INTERFACE_NOT_FOUND]
      }));

      sendSpy.reset();
    });

    it('must return an error when a method does not exist', () => {
      emulateHandshakeOnServer();

      const sendSpy = chai.spy.on(serverTransportMock, 'send');

      serverTransportMock.emitPacket({
        call: [1, constants.TEST_INTERFACE],
        methodThatDoesNotExist: []
      });

      expect(sendSpy).to.be.called.with(jstp.stringify({
        callback: [1],
        error: [jstp.ERR_METHOD_NOT_FOUND]
      }));

      sendSpy.reset();
    });
  });

  describe('callback', () => {
    testPacketSending('callback', (connection, transport) => {
      const sendSpy = chai.spy((data) => {
        const packet = jstp.parse(data);

        expect(packet).to.contain.all.keys(['callback']);
        expect(packet).to.contain.any.keys(['ok', 'error']);

        if (packet.ok) {
          expect(packet.callback).to.eql([10]);
          expect(packet.ok).to.eql([42]);
        } else {
          expect(packet.callback).to.eql([11]);
          expect(packet.error).to.eql([jstp.ERR_METHOD_NOT_FOUND]);
        }
      });

      transport.on('dataSent', sendSpy);

      connection.callback(10, null, [42]);
      connection.callback(11, new jstp.RemoteError(jstp.ERR_METHOD_NOT_FOUND));

      expect(sendSpy).to.have.been.called.twice;
    });

    it('must process a callback packet with a result', () => {
      const callback = chai.spy((error, result) => {
        expect(error).to.not.exist;
        expect(result).to.equal('result');
      });

      performHandshakeFromClient(() => {
        clientConnection.callMethod(
          constants.TEST_INTERFACE, 'method', [], callback);

        clientTransportMock.emitPacket({
          callback: [1],
          ok: ['result']
        });

        expect(callback).to.be.called();
      });
    });

    it('must process a callback packet with an error', () => {
      const callback = chai.spy((error) => {
        expect(error).to.be.an.instanceof(jstp.RemoteError);
        expect(error.code).to.equal(jstp.ERR_INTERNAL_API_ERROR);
      });

      performHandshakeFromClient(() => {
        clientConnection.callMethod(
          constants.TEST_INTERFACE, 'method', [], callback);

        clientTransportMock.emitPacket({
          callback: [1],
          error: [jstp.ERR_INTERNAL_API_ERROR]
        });

        expect(callback).to.be.called();
      });
    });
  });

  describe('state', () => {
    testPacketSending('state', (connection, transport) => {
      const sendSpy = chai.spy((data) => {
        const packet = jstp.parse(data);
        expect(packet).to.have.all.keys(['state', 'inc']);
        expect(packet.state).to.be.an('array');
      });

      transport.on('dataSent', sendSpy);

      connection.notifyStateChange('stats.connections', 'inc', 1);
      expect(sendSpy).to.have.been.called();
    });

    it('must process state packets', () => {
      const handler = chai.spy((stateChange) => {
        expect(stateChange.path).to.equal('counter');
        expect(stateChange.verb).to.equal('inc');
        expect(stateChange.value).to.equal(1);
      });

      clientConnection.on('state', handler);

      performHandshakeFromClient(() => {
        clientTransportMock.emitPacket({
          state: [-1, 'counter'],
          inc: 1
        });

        expect(handler).to.be.called();
      });
    });
  });
});
