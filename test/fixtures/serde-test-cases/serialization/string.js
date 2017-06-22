'use strict';

module.exports = [
  {
    name: 'string containing inline comment',
    value: '// inline comment',
    serialized: '\'// inline comment\''
  },
  {
    name: 'string containing block comment',
    value: '/* block comment */',
    serialized: '\'/* block comment */\''
  },
  {
    name: 'string with number inside',
    value: '0.5',
    serialized: '\'0.5\''
  }
];
