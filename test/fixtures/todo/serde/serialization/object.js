'use strict';

module.exports = [
  {
    name: 'object with numeric literal as key',
    value: { 42: true },
    serialized: '{42:true}',
  },
  {
    name: 'object with identifier names as keys',
    value: { $: 'dollar', _$_: 'multiple symbols' },
    serialized: "{$:'dollar',_$_:'multiple symbols'}",
  },
  {
    name:
      'object with identifier name, ' +
      'containing non-latin Unicode literals, as a key',
    value: { ümlåût: "that's not really an ümlaüt, but this is" },
    serialized: "{ümlåût:'that\\'s not really an ümlaüt, but this is'}",
  },
];
