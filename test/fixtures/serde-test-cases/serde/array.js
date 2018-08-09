'use strict';

module.exports = [
  {
    name: 'empty array',
    value: [],
    serialized: '[]',
  },
  {
    name: 'array of integers',
    value: [1, 2, 3],
    serialized: '[1,2,3]',
  },
  {
    name: 'nested arrays',
    value: ['outer', ['inner']],
    serialized: "['outer',['inner']]",
  },
  {
    name: 'Marcus array',
    value: [
      'Marcus Aurelius',
      'AE127095',
      ['1990-02-15T00:00:00.000Z', 'Rome'],
      ['Ukraine', 'Kiev', '03056', 'Pobedy', '37', '1', '158'],
    ],
    serialized:
      "['Marcus Aurelius','AE127095'," +
      "['1990-02-15T00:00:00.000Z','Rome']," +
      "['Ukraine','Kiev','03056','Pobedy','37','1','158']]",
  },
];
