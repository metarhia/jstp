'use strict';

const jstp = require('../../');

const name = 'testApp';
const login = 'login';
const password = 'password';
const sessionId = '12892e85-5bd7-4c77-a0c5-a0aecfcbc93a';

const interfaces = {};

const authCallback = (
  connection, application, strategy, credentials, callback
) => {
  if (application.name !== name) {
    return callback(new jstp.RemoteError(jstp.ERR_APP_NOT_FOUND));
  }

  let username = null;
  let success = false;

  if (strategy === 'anonymous') {
    success = true;
  }

  if (strategy === 'login' &&
      credentials[0] === login &&
      credentials[1] === password) {
    success = true;
    username = login;
  }

  if (success) {
    callback(null, username, sessionId);
  }
  callback(new jstp.RemoteError(jstp.ERR_AUTH_FAILED));
};

module.exports = {
  name,
  interfaces,
  login,
  password,
  sessionId,
  authCallback
};
