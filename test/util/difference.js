'use strict';

const jstp = require('../..');

module.exports = (value, expected) => `expected
--->
${jstp.stringify(expected)}
<--- but found --->
${jstp.stringify(value)}
<---`;
