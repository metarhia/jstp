'use strict';

const chai = require('chai');
const chaiSpies = require('chai-spies');

const RemoteProxy = require('../..').RemoteProxy;

const expect = chai.expect;
chai.use(chaiSpies);

describe('RemoteProxy', () => {
  let proxy;

  const connectionMock = {
    callMethod(interfaceName, methodName, args, callback) {
      const results = { method1: 'result1', method2: 'result2' };
      callback(results[methodName]);
    },

    emitRemoteEvent() { },

    processEventPacket() {
      proxy._emitLocal('testEvent', ['payload1', 'payload2']);
    }
  };

  let callSpy;
  let eventSpy;

  beforeEach(() => {
    callSpy = chai.spy.on(connectionMock, 'callMethod');
    eventSpy = chai.spy.on(connectionMock, 'emitRemoteEvent');

    proxy = new RemoteProxy(connectionMock,
      'testInterface', ['method1', 'method2']);
  });

  afterEach(() => {
    callSpy.reset();
    eventSpy.reset();
  });

  it('must call remote methods', () => {
    const callback1 = chai.spy();
    const callback2 = chai.spy();

    proxy.method1(callback1);
    expect(callSpy).to.have.been.called.with(
      'testInterface', 'method1', [], callback1);

    proxy.method2(1, 2, 3, callback2);
    expect(callSpy).to.have.been.called.with(
      'testInterface', 'method2', [1, 2, 3], callback2);

    expect(callSpy).to.have.been.called.exactly(2);

    expect(callback1).to.have.been.called.exactly(1);
    expect(callback1).to.have.been.called.with('result1');

    expect(callback2).to.have.been.called.exactly(1);
    expect(callback2).to.have.been.called.with('result2');
  });

  it('must emit events through the network and locally', () => {
    const handler = chai.spy();
    proxy.on('testEvent', handler);
    proxy.emit('testEvent', 'payload1', 'payload2');

    expect(eventSpy).to.have.been.called.exactly(1);
    expect(eventSpy).to.have.been.called.with(
      'testInterface', 'testEvent', ['payload1', 'payload2']);

    expect(handler).to.have.been.called.exactly(1);
    expect(handler).to.have.been.called.with('payload1', 'payload2');
  });

  it('must not re-emit events back', () => {
    const handler = chai.spy();
    proxy.on('testEvent', handler);
    connectionMock.processEventPacket();

    expect(handler).to.have.been.called.with('payload1', 'payload2');
    expect(eventSpy).to.not.have.been.called();
  });
});
