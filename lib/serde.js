'use strict';

const stringify = require('./stringify');

const safeRequire = (moduleName) => {
  try {
    return [null, require(moduleName)];
  } catch (err) {
    return [err, null];
  }
};

let [error, jstpNative] = safeRequire('../build/Release/jstp');

if (error) {
  console.warn(error.toString());
  [error, jstpNative] = safeRequire('../build/Debug/jstp');
}

if (jstpNative) {
  module.exports = Object.assign(
    Object.create(null), jstpNative, { stringify }
  );
} else {
  console.warn(
    error + '\n' +
    'JSTP native addon is not built or is not functional. ' +
    'Run `npm install` in order to build it, otherwise you will get ' +
    'poor performance.'
  );
  module.exports = require('./serde-fallback');
}
