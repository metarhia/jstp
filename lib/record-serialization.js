'use strict';

const serializerFactory = require('./serializer-factory');

const jsrs = {};
module.exports = jsrs;

// Change to true if you want to use the native C++ version of JSRS serializer.
// Currently the JavaScript version is quite faster (contrary to the parser,
// C++ version of which is a lot faster than the JavaScript one) though it is
// one of our priorities to optimize it.
const USE_NATIVE_SERIALIZER = false;

let jstpNative;

try {
  jstpNative = require('../build/Release/jstp');
} catch (e) {
  try {
    jstpNative = require('../build/Debug/jstp');
  } catch (e) {
    console.warn(
      'JSTP native addon is not built. ' +
      'Run `npm install` in order to build it, otherwise you will get ' +
      'poor server performance under load.'
    );
    module.exports = require('./record-serialization-fallback');
  }
}

if (jstpNative) {
  Object.assign(jsrs, jstpNative);
  if (!USE_NATIVE_SERIALIZER) {
    jsrs.stringify = serializerFactory.createSerializer();
  }
}
