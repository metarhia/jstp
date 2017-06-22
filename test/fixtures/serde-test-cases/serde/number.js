'use strict';

module.exports = [
  {
    name: 'integer',
    value: 42,
    serialized: '42'
  },
  {
    name: 'negative integer',
    value: -3,
    serialized: '-3'
  },
  {
    name: 'float',
    value: 1e100,
    serialized: '1e+100'
  },
  {
    name: 'float with comma',
    value: 3.14,
    serialized: '3.14'
  },
  {
    name: 'small float',
    value: 1e-3,
    serialized: '0.001'
  }
];
