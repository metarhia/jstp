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
    name: 'whole packet followed by a half-packet',
    message: '{a:1}\0{b:',
    result: [{ a: 1 }],
    remainder: '{b:',
  },
  {
    name: 'a whole packet followed by a whole packet',
    message: '{a:1}\0{b:2}\0',
    result: [{ a: 1 }, { b: 2 }],
    remainder: '',
  },
];
