'use strict';

module.exports = [
  {
    name: 'a half-message',
    message: '{a:',
    result: [],
    remainder: '{a:',
  },
  {
    name: 'a whole message',
    message: '{a:1}\0',
    result: [{ a: 1 }],
    remainder: '',
  },
  {
    name: 'whole message followed by a half-message',
    message: '{a:1}\0{b:',
    result: [{ a: 1 }],
    remainder: '{b:',
  },
  {
    name: 'a whole message followed by a whole message',
    message: '{a:1}\0{b:2}\0',
    result: [{ a: 1 }, { b: 2 }],
    remainder: '',
  },
];
