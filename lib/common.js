'use strict';

var common = {};
module.exports = common;

// Tests if a value is null or undefined
//   value - a value to test
//
function isNull(value) {
  return value === null || value === undefined;
}

// Populate a target object with all the properties
// of arbitrary number of other objects
// Signature:
//   common.extend(target, ...sources);
// Parameters:
//   target - object to copy properties into
//   ...sources - source objects
//
common.extend = function(target) {
  if (isNull(target)) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  if (typeof(target) !== 'object') {
    target = new Object(target);
  }

  var sources = Array.prototype.slice
    .call(arguments, 1)
    .filter(function(source) {
      return !isNull(source);
    });

  sources.forEach(function(source) {
    Object.keys(source).forEach(function(key) {
      target[key] = source[key];
    });
  });

  return target;
};

if (Object.assign) {
  common.extend = Object.assign;
}

// Forward an event from one EventEmitter to another
//   from - EventEmitter to listen for event
//   to - EventEmitter to emit event on
//   eventName - name of the event
//   newEventName - name of the forwarded event (optional)
//
common.forwardEvent = function(from, to, eventName, newEventName) {
  from.on(eventName, function(eventArgs) {
    to.emit(newEventName || eventName, eventArgs, to);
  });
};

// Forward events from one EventEmitter to another
//   from - EventEmitter to listen for event
//   to - EventEmitter to emit event on
//   eventNames - array of names of events
//
common.forwardMultipleEvents = function(from, to, eventNames) {
  eventNames.forEach(function(event) {
    common.forwardEvent(from, to, event);
  });
};

// Create a zero-filled buffer of specified size
//   size - desired buffer size
//
common.createZeroFilledBuffer = function(size) {
  var buffer = new Buffer(size);
  buffer.fill(0);

  return buffer;
};

if (Buffer.alloc) {
  common.createZeroFilledBuffer = Buffer.alloc;
}

// This function can be used in contexts where a function (e.g., a callback) is
// required but no actions have to be done.
//
common.doNothing = function() { };
