'use strict';

const safeRequire = require('./common').safeRequire;
const serialize = require('./json5-serialize');

let [error, jstpNative] = safeRequire('../build/Release/jstp');

if (error) {
  console.warn(error.toString());
  [error, jstpNative] = safeRequire('../build/Debug/jstp');
}

if (jstpNative) {
  module.exports = Object.assign(
    Object.create(null), jstpNative, { stringify: serialize }
  );
} else {
  console.warn(
    error + '\n' +
    'JSTP native addon is not built or is not functional. ' +
    'Run `npm install` in order to build it, otherwise you will get ' +
    'poor performance.'
  );
  module.exports = require('./record-serialization-fallback');
}
