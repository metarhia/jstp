'use strict';

module.exports = [
  {
    name: 'sparse arrays',
    // eslint-disable-next-line no-sparse-arrays
    value: [1, , 3],
    serialized: '[1,,3]',
  },
];
