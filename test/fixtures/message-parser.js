'use strict';

module.exports = [
  {
    name: 'a half-message',
    message: '{a:',
    result: [],
    parsedLength: 0,
  },
  {
    name: 'a whole message',
    message: '{a:1}\0',
    result: [{ a: 1 }],
    parsedLength: 6,
  },
  {
    name: 'whole message followed by a half-message',
    message: '{a:1}\0{b:',
    result: [{ a: 1 }],
    parsedLength: 6,
  },
  {
    name: 'a whole message followed by a whole message',
    message: '{a:1}\0{b:2}\0',
    result: [{ a: 1 }, { b: 2 }],
    parsedLength: 12,
  },
];
