'use strict';

const common = {};
module.exports = common;

// Forward an event from one EventEmitter to another
//   from - EventEmitter to listen for event
//   to - EventEmitter to emit event on
//   eventName - name of the event
//   newEventName - name of the forwarded event (optional)
//
common.forwardEvent = (from, to, eventName, newEventName = eventName) => {
  from.on(eventName, (...eventArgs) => {
    to.emit(newEventName, ...eventArgs);
  });
};

// Forward events from one EventEmitter to another
//   from - EventEmitter to listen for event
//   to - EventEmitter to emit event on
//   eventNames - array of names of events
//
common.forwardMultipleEvents = (from, to, eventNames) => {
  eventNames.forEach((event) => {
    common.forwardEvent(from, to, event);
  });
};

// Try to require `moduleName` and return the exported object if the module is
// found or null otherwise.
//
common.safeRequire = (moduleName) => {
  try {
    return require(moduleName);
  } catch (err) {
    console.warn(err.toString());
    return null;
  }
};

// Mixin source methods to target without overriding existing methods
// for ES6 classes.
//
common.mixin = (target, source) => {
  Object.getOwnPropertyNames(source.prototype).forEach((property) => {
    if (!target.prototype[property]) {
      target.prototype[property] = source.prototype[property];
    }
  });
};

// If last element of the array args is a function then
// pops the array and returns that function else return null
//
common.extractCallback = (args) => {
  if (args.length > 0 && typeof args[args.length - 1] === 'function') {
    return args.pop();
  }
  return null;
};

// This function can be used in contexts where a function (e.g., a callback) is
// required but no actions have to be done.
//
common.doNothing = () => {};
