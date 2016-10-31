'use strict';

var events = require('events');
var util = require('util');

var applicationMock = require('./application');

module.exports = ClientMock;

// Client mock
//
function ClientMock() {
  events.EventEmitter.call(this);
}

util.inherits(ClientMock, events.EventEmitter);

ClientMock.prototype.getApplication = function() {
  return applicationMock;
};
