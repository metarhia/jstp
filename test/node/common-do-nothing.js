'use strict';

const tap = require('tap');

const common = require('../../lib/common');

tap.equal(common.doNothing(), undefined, 'must not return a value');
