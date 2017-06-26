'use strict';

module.exports = [
  {
    name: 'binary number starting with 0b',
    value: 42,
    serialized: '0b101010'
  },
  {
    name: 'binary number starting with 0B',
    value: 42,
    serialized: '0B101010'
  },
  {
    name: 'octal number starting with 0o',
    value: 42,
    serialized: '0o52'
  },
  {
    name: 'octal number starting with 0O',
    value: 42,
    serialized: '0O52'
  },
  {
    name: 'hex number starting with 0x',
    value: 42,
    serialized: '0x2a'
  },
  {
    name: 'hex number starting with 0X',
    value: 42,
    serialized: '0X2A'
  }
];
