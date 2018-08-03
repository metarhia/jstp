'use strict';

const jstp = require('../..');

const name = 'testApp';
const login = 'login';
const password = 'password';

const expectedErrorMessage = 'Zero division';

const interfaces = {
  calculator: {
    answer(connection, callback) {
      callback(null, 42);
    },
    divide(connection, divident, divisor, callback) {
      if (!divisor) {
        callback(new Error(expectedErrorMessage));
      } else {
        callback(null, divident / divisor);
      }
    },
    doNothing(connection, callback) {
      callback(null);
    },
  },
  someService: {
    sayHi(connection, name, callback) {
      callback(null, `Hi, ${name}!`);
    },
    say(connection, word, callback) {
      callback(null, word);
    },
  },
  someOtherService: {
    method(connection, argument, callback) {
      callback(null, argument);
    },
    otherMethod(connection, callback) {
      callback(null);
    },
  },
};

const authCallback = (
  connection,
  application,
  strategy,
  credentials,
  callback
) => {
  if (application.name !== name) {
    callback(new jstp.RemoteError(jstp.ERR_APP_NOT_FOUND));
    return;
  }

  let username = null;
  let success = false;

  if (
    strategy === 'login' &&
    credentials[0] === login &&
    credentials[1] === password
  ) {
    success = true;
    username = login;
  }

  if (!success) {
    callback(new jstp.RemoteError(jstp.ERR_AUTH_FAILED));
  }
  callback(null, username);
};

module.exports = {
  name,
  interfaces,
  login,
  password,
  authCallback,
  expectedErrorMessage,
};
