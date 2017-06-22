'use strict';

module.exports = [
  {
    name: 'object omitting undefined fields',
    value: { field1: 'value', field2: undefined },
    serialized: '{field1:\'value\'}'
  },
  {
    name: 'object omitting functions',
    value: { key: 42, fn() {} },
    serialized: '{key:42}'
  },
  {
    name: 'object with non-identifier keys',
    value: { '*': 42 },
    serialized: '{\'*\':42}'
  },
  {
    name: 'object with keyword as key',
    value: { while: true },
    serialized: '{while:true}'
  }
];
