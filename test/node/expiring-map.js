'use strict';

const test = require('tap');

const { ExpiringMap } = require('../../lib/common');

const INTERVAL = 1000;
const GUARANTEED_DELETION_TIME = INTERVAL * 3;
const KEY = 'key';
const VALUE = 'value';

test.test(
  'must delete entry on next interval iteration',
  test => {
    const map = new ExpiringMap(INTERVAL);
    map.set(KEY, VALUE);
    map.delete(KEY);
    setTimeout(() => {
      test.assertNot(map.has(KEY));
      test.end();
    }, GUARANTEED_DELETION_TIME);
  }
);

test.test(
  'must not delete entry if it was requested before interval iteration',
  test => {
    const map = new ExpiringMap(INTERVAL);
    map.set(KEY, VALUE);
    map.delete(KEY);

    setTimeout(() => {
      map.get(KEY);
    }, INTERVAL / 2);

    setTimeout(() => {
      const value = map.get(KEY);
      test.equals(value, VALUE);
      test.end();
    }, GUARANTEED_DELETION_TIME);
  }
);
