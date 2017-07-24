'use strict';

module.exports = [
  {
    name: 'binary numbers',
    value: 10,
    serialized: '0b1010',
  },
  {
    name: 'octal numbers',
    value: 83,
    serialized: '0o123',
  },
  {
    name: 'hexadecimal numbers',
    value: 0xff,
    serialized: '0xff',
  },
  {
    name: 'hexadecimal numbers in upper case',
    value: 0xAF,
    serialized: '0xAF',
  },
  {
    name: 'binary number starting with 0b',
    value: 42,
    serialized: '0b101010',
    todo: true,
  },
  {
    name: 'binary number starting with 0B',
    value: 42,
    serialized: '0B101010',
    todo: true,
  },
  {
    name: 'octal number starting with 0o',
    value: 42,
    serialized: '0o52',
    todo: true,
  },
  {
    name: 'octal number starting with 0O',
    value: 42,
    serialized: '0O52',
    todo: true,
  },
  {
    name: 'hex number starting with 0x',
    value: 42,
    serialized: '0x2a',
    todo: true,
  },
  {
    name: 'hex number starting with 0X',
    value: 42,
    serialized: '0X2A',
    todo: true,
  },
];
