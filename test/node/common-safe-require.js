'use strict';

const test = require('tap');

const common = require('../../lib/common');

const existingModule = 'fs';
const nonExistingModule = '__non_existing_module__';

test.ok(common.safeRequire(existingModule)[1], 'must require existing module');

test.equal(common.safeRequire(nonExistingModule)[1], null,
  'must return \'null\' if module doesn\'t exist');
