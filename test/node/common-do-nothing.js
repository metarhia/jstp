'use strict';

const test = require('tap');

const common = require('../../lib/common');

test.equal(common.doNothing(), undefined, 'must not return a value');
