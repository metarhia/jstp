'use strict';

const jstp = require('../../../');
const RemoteError = jstp.RemoteError;

module.exports = {
  remoteError: require('./remote-error'),
  getJstpArray: require('./get-jstp-array'),
  errorMessages: Object.keys(jstp)
    .filter(key => key.startsWith('ERR_'))
    .map(key => jstp[key].toString())
};
