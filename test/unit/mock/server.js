'use strict';

const events = require('events');
const util = require('util');

const jstp = require('../../..');

const constants = require('../constants');
const applicationMock = require('./application');

module.exports = ServerMock;

// Server mock
//
function ServerMock() {
  events.EventEmitter.call(this);

  this.applications = {};
  this.applications[constants.TEST_APPLICATION] = applicationMock;
}

util.inherits(ServerMock, events.EventEmitter);

ServerMock.prototype.listen = function(callback) {
  callback();
};

ServerMock.prototype.getClients = function() {
  return [];
};

ServerMock.prototype.broadcast = function() { };

ServerMock.prototype.startSession =
  function(connection, application, strategy, credentials, callback) {
    if (application.name !== constants.TEST_APPLICATION) {
      return callback(new jstp.RemoteError(jstp.ERR_APP_NOT_FOUND));
    }

    let username = null;
    let success = false;

    if (strategy === 'anonymous') {
      success = true;
    }

    if (strategy === 'login' &&
        credentials[0] === constants.TEST_USERNAME &&
        credentials[1] === constants.TEST_PASSWORD) {
      success = true;
      username = constants.TEST_USERNAME;
    }

    if (success) {
      callback(null, username, constants.TEST_SESSION_ID);
    } else {
      callback(new jstp.RemoteError(jstp.ERR_AUTH_FAILED));
    }
  };
