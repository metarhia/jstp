'use strict';

const tap = require('tap');

const common = require('../../lib/common');

const existingModule = '../..';
const nonExistingModule = '__non_existinting_module__';

tap.ok(common.safeRequire(existingModule), 'must require existing module');

tap.equal(common.safeRequire(nonExistingModule), null,
  'must return \'null\' if module doesn\'t exist');
