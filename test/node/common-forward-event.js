'use strict';

const tap = require('tap');
const sinon = require('sinon');

const events = require('events');

const common = require('../../lib/common');

tap.test('must forward a single event', (test) => {
  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  const spy = sinon.spy();

  common.forwardEvent(sourceEventEmitter, targetEventEmitter, 'testEvent');
  targetEventEmitter.on('testEvent', spy);

  sourceEventEmitter.emit('testEvent');
  test.assert(spy.called, 'event handler must be called');
  test.end();
});

tap.test('must forward a single event under a new name', (test) => {
  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  const spy = sinon.spy();

  common.forwardEvent(sourceEventEmitter, targetEventEmitter,
                        'testEvent', 'renamedEvent');
  targetEventEmitter.on('renamedEvent', spy);

  sourceEventEmitter.emit('testEvent');
  test.assert(spy.called, 'event handler must be called');
  test.end();
});

tap.test('must forward multiple events', (test) => {
  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  const firstSpy = sinon.spy();
  const secondSpy = sinon.spy();

  common.forwardMultipleEvents(sourceEventEmitter, targetEventEmitter, [
    'event1',
    'event2'
  ]);

  targetEventEmitter.on('event1', firstSpy);
  targetEventEmitter.on('event2', secondSpy);

  sourceEventEmitter.emit('event1');
  sourceEventEmitter.emit('event2');

  test.assert(firstSpy.called, 'first event handler must be called');
  test.assert(secondSpy.called, 'second event handler must be called');
  test.end();
});

