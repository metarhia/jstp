'use strict';

module.exports = [
  {
    name: 'Unicode code point escapes',
    value: '💚💛',
    serialized: '\'\\u{1F49A}\\u{1F49B}\'',
  },
  {
    name: 'hexadecimal escape sequences',
    value: 'Hello',
    serialized: '\'\\x48\\x65\\x6c\\x6c\\x6f\'',
  },
];
