'use strict';

/* eslint-env browser */

// Browser adapter for required functions from Node.js crypto module.
const crypto = {};

crypto.randomBytes = (count) => {
  const buf = Buffer.alloc(count);
  crypto.randomFillSync(buf);
  return buf;
};

if (window.crypto && window.crypto.getRandomValues) {
  crypto.randomFillSync = (buf) => {
    window.crypto.getRandomValues(buf);
  };
} else {
  console.warn(
    'Web Crypto API is not supported in your browser!',
    'Using Math.random() instead.'
  );
  crypto.randomFillSync = (buf) => {
    for (let i = 0; i < buf.length; i++) {
      buf[i] = Math.floor(0x100 * Math.random());
    }
  };
}

module.exports = crypto;
