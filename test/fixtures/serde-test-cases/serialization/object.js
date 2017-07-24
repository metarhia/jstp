'use strict';

module.exports = [
  {
    name: 'object omitting undefined fields',
    value: { field1: 'value', field2: undefined },
    serialized: '{field1:\'value\'}',
  },
  {
    name: 'object omitting functions',
    value: { key: 42, fn() {} },
    serialized: '{key:42}',
  },
  {
    name: 'object with non-identifier keys',
    value: { '*': 42 },
    serialized: '{\'*\':42}',
  },
  {
    name: 'object with keyword as key',
    value: { while: true },
    serialized: '{while:true}',
  },
  {
    name: 'object with numeric literal as key',
    value: { 42: true },
    serialized: '{42:true}',
    todo: true,
  },
  {
    name: 'object with identifier names as keys',
    value: { $: 'dollar', _$_: 'multiple symbols' },
    serialized: '{$:\'dollar\',_$_:\'multiple symbols\'}',
    todo: true,
  },
  {
    name: 'object with identifier name, ' +
      'containing non-latin Unicode literals, as a key',
    value: { ümlåût: 'that\'s not really an ümlaüt, but this is' },
    serialized: '{ümlåût: \'that\\\'s not really an ümlaüt, but this is\'}',
    todo: true,
  },
];
