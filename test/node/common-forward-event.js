'use strict';

const test = require('tap').test;

const events = require('events');

const common = require('../../lib/common');

test('must forward a single event', (test) => {
  test.plan(1);

  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  common.forwardEvent(sourceEventEmitter, targetEventEmitter, 'testEvent');
  targetEventEmitter.on('testEvent', () => {
    test.pass('event handler must be called');
  });

  sourceEventEmitter.emit('testEvent');
});

test('must forward a single event under a new name', (test) => {
  test.plan(1);

  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  common.forwardEvent(sourceEventEmitter, targetEventEmitter,
                        'testEvent', 'renamedEvent');

  targetEventEmitter.on('renamedEvent', () => {
    test.pass('event handler must be called');
  });

  sourceEventEmitter.emit('testEvent');
});

test('must forward multiple events', (test) => {
  test.plan(2);

  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  common.forwardMultipleEvents(sourceEventEmitter, targetEventEmitter, [
    'event1',
    'event2'
  ]);

  targetEventEmitter.on('event1', () => {
    test.pass('first event handler must be called');
  });
  targetEventEmitter.on('event2', () => {
    test.pass('second event handler must be called');
  });

  sourceEventEmitter.emit('event1');
  sourceEventEmitter.emit('event2');
});
