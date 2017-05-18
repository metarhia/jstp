'use strict';

const jstp = require('../../../');

module.exports = Object.keys(jstp)
  .filter(key => key.startsWith('ERR_'))
  .map(key => jstp[key].toString());
