'use strict';

var events = require('events');
var util = require('util');

var TransportMock = require('./transport');

module.exports = RawServerMock;

// Underlying server adapter mock
//
function RawServerMock() {
  events.EventEmitter.call(this);
}

util.inherits(RawServerMock, events.EventEmitter);

RawServerMock.prototype.listen = pass;

RawServerMock.prototype.close = pass;

RawServerMock.prototype.createTransport = function() {
  return new TransportMock();
};

function pass(callback) {
  if (callback) {
    callback();
  }
}
