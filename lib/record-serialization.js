'use strict';

const { curry } = require('metarhia-common');
const { altConcatLazy, either, safeRequire } = require('./common');
const serialize = require('./json5-serialize');

const jsrs = {};
module.exports = jsrs;

// Change to true if you want to use the native C++ version of JSRS serializer.
// Currently the JavaScript version is quite faster (contrary to the parser,
// C++ version of which is a lot faster than the JavaScript one) though it is
// one of our priorities to optimize it.
const USE_NATIVE_SERIALIZER = false;

const jstpNativeE = altConcatLazy(
  curry(safeRequire, '../build/Release/jstp'),
  curry(safeRequire, '../build/Debug/jstp')
);

either(console.warn, (jstpNative) => {
  if (jstpNative) {
    Object.assign(jsrs, jstpNative);
    if (!USE_NATIVE_SERIALIZER) {
      jsrs.stringify = serialize;
    }
  } else {
    console.warn(
      'JSTP native addon is not built or is not functional. ' +
      'Run `npm install` in order to build it, otherwise you will get ' +
      'poor performance.'
    );
    module.exports = require('./record-serialization-fallback');
  }
}, jstpNativeE);
