'use strict';

module.exports = [
  {
    name: 'true',
    value: true,
    serialized: 'true'
  },
  {
    name: 'false',
    value: false,
    serialized: 'false'
  },
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
    name: 'smallFloat',
    value: 1e-3,
    serialized: '0.001'
  },
  {
    name: 'undefined',
    value: undefined,
    serialized: 'undefined'
  },
  {
    name: 'null',
    value: null,
    serialized: 'null'
  },
  {
    name: 'string',
    value: 'str',
    serialized: '\'str\''
  },
  {
    name: 'string with endline',
    value: 'first\nsecond',
    serialized: '\'first\\nsecond\''
  },
  {
    name: 'string with single quote',
    value: 'it\'s',
    serialized: '\'it\\\'s\''
  },
  {
    name: 'string with \\u',
    value: '01\u0000\u0001',
    serialized: '\'01\\u0000\\u0001\''
  },
  {
    name: 'empty array',
    value: [],
    serialized: '[]'
  },
  {
    name: 'array of integers',
    value: [1, 2, 3],
    serialized: '[1,2,3]'
  },
  {
    name: 'nested arrays',
    value: ['outer', ['inner']],
    serialized: '[\'outer\',[\'inner\']]'
  },
  {
    name: 'empty object',
    value: {},
    serialized: '{}'
  },
  {
    name: 'object',
    value: { field1: 'value', field2: null },
    serialized: '{field1:\'value\',field2:null}'
  },
  {
    name: 'Marcus array',
    value: [
      'Marcus Aurelius',
      'AE127095',
      [
        '1990-02-15T00:00:00.000Z',
        'Rome'
      ],
      [
        'Ukraine',
        'Kiev',
        '03056',
        'Pobedy',
        '37',
        '1',
        '158'
      ]
    ],
    serialized: '[\'Marcus Aurelius\',\'AE127095\',' +
    '[\'1990-02-15T00:00:00.000Z\',\'Rome\'],' +
    '[\'Ukraine\',\'Kiev\',\'03056\',\'Pobedy\',\'37\',\'1\',\'158\']]'
  },
  {
    name: 'Marcus object',
    value: {
      name: 'Marcus Aurelius',
      passport: 'AE127095',
      birth: {
        date: '1990-02-15T00:00:00.000Z',
        place: 'Rome'
      },
      address: {
        country: 'Ukraine',
        city: 'Kiev',
        zip: '03056',
        street: 'Pobedy',
        building: '37',
        floor: '1',
        room: '158'
      }
    },
    serialized: '{name:\'Marcus Aurelius\',passport:\'AE127095\',' +
    'birth:{date:\'1990-02-15T00:00:00.000Z\',place:\'Rome\'},' +
    'address:{country:\'Ukraine\',city:\'Kiev\',zip:\'03056\',' +
    'street:\'Pobedy\',building:\'37\',floor:\'1\',room:\'158\'}}'
  }
];
