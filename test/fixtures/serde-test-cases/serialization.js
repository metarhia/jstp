'use strict';

module.exports = [
  {
    name: 'sparse arrays',
    // eslint-disable-next-line no-sparse-arrays
    value: [1, , 3],
    serialized: '[1,,3]'
  },
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
  }
];
