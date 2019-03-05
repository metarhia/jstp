'use strict';

const deprecate = (fn, msg) => {
  let warned = false;
  return function deprecated(...args) {
    if (!warned) {
      console.warn('DeprecationWarning:', msg);
      warned = true;
    }
    fn.apply(this, args);
  };
};

module.exports = deprecate;
