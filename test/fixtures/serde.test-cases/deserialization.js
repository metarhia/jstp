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
  },
  {
    name: 'binary numbers',
    value: 10,
    serialized: '0b1010'
  },
  {
    name: 'octal numbers',
    value: 83,
    serialized: '0o123'
  },
  {
    name: 'hexadecimal numbers',
    value: 0xff,
    serialized: '0xff'
  },
  {
    name: 'hexadecimal numbers in upper case',
    value: 0xAF,
    serialized: '0xAF'
  },
  {
    name: 'Unicode code point escapes',
    value: '💚💛',
    serialized: '\'\\u{1F49A}\\u{1F49B}\''
  },
  {
    name: 'sparse array',
    value: [1, undefined, 3],
    serialized: '[1,,3]'
  }
];
