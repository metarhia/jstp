'use strict';

module.exports = [
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
    name: 'string with Unicode escape sequences',
    value: '01\u0000\u0001',
    serialized: '\'01\\u0000\\u0001\''
  },
  {
    name: 'string with Unicode escape sequences followed by numbers',
    value: '\u00000\u00011',
    serialized: '\'\\u00000\\u00011\''
  }
];
