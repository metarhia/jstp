'use strict';

const tap = require('tap');
const tsame = require('tsame');

tap.Test.prototype.addAssert('oneOf', 2,
  function(found, allowed, message, extra) {
    message = message || 'must be one of allowed';

    extra.found = found;
    extra.pattern = allowed;

    for (const obj of allowed) {
      if (tsame.strict(found, obj)) {
        return this.pass(message, extra);
      }
    }

    this.fail(message, extra);
  }
);
