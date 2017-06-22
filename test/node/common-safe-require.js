'use strict';

const test = require('tap');

const common = require('../../lib/common');

const existingModule = 'fs';
const nonExistingModule = '__non_existing_module__';
const expectedErrMsg = `Cannot find module '${nonExistingModule}'`;

test.ok(common.safeRequire(existingModule), 'must require existing module');

test.equal(common.safeRequire(nonExistingModule).val.message, expectedErrMsg,
  'must return \'null\' if module doesn\'t exist');
