'use strict';

module.exports = [
  {
    name: 'object with whitespaces',
    value: { key: 42 },
    serialized: '{ key:\n\t42 }'
  },
  {
    name: 'object with single-quoted keys',
    value: { key: 42 },
    serialized: '{\'key\': 42}'
  },
  {
    name: 'object with double-quoted keys',
    value: { key: 42 },
    serialized: '{"key": 42}'
  }
];
