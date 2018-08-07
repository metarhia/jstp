'use strict';

const test = require('tap');

const SimpleSessionStorageProvider =
  require('../../lib/simple-session-storage-provider');

const SESSION_LIFETIME = 1000;
const INTERVAL = 1000;
const GUARANTEED_DELETION_TIME = INTERVAL * 3;
const SESSION_ID = 'key';
const SESSION = {};

test.test('must set and get session', (test) => {
  const storageProvider = new SimpleSessionStorageProvider(
    SESSION_LIFETIME,
    INTERVAL
  );

  storageProvider.set(SESSION_ID, SESSION);
  test.equals(storageProvider.get(SESSION_ID), SESSION);
  test.end();
});

test.test('must delete session after expiration', (test) => {
  const storageProvider = new SimpleSessionStorageProvider(
    SESSION_LIFETIME,
    INTERVAL
  );

  storageProvider.set(SESSION_ID, SESSION);
  storageProvider.setInactive(SESSION_ID);
  setTimeout(() => {
    test.assertNot(storageProvider.get(SESSION_ID));
    test.end();
  }, GUARANTEED_DELETION_TIME);
});

test.test('must not delete active session', (test) => {
  const storageProvider = new SimpleSessionStorageProvider(
    SESSION_LIFETIME,
    INTERVAL
  );

  storageProvider.set(SESSION_ID, SESSION);
  setTimeout(() => {
    test.assert(storageProvider.get(SESSION_ID));
    test.end();
  }, GUARANTEED_DELETION_TIME);
});

test.test('get must mark session as active', (test) => {
  const storageProvider = new SimpleSessionStorageProvider(
    SESSION_LIFETIME,
    INTERVAL
  );

  storageProvider.set(SESSION_ID, SESSION);
  storageProvider.setInactive(SESSION_ID);
  storageProvider.get(SESSION_ID);

  setTimeout(() => {
    test.assert(storageProvider.get(SESSION_ID));
    test.end();
  }, GUARANTEED_DELETION_TIME);
});

test.test('must not get session if none is set', (test) => {
  const storageProvider = new SimpleSessionStorageProvider(
    SESSION_LIFETIME,
    INTERVAL
  );

  test.assertNot(storageProvider.get(SESSION_ID));
  test.end();
});
