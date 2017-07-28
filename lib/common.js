'use strict';

// Forward an event from one EventEmitter to another.
//   from - EventEmitter to listen for event
//   to - EventEmitter to emit event on
//   eventName - name of the event
//   newEventName - name of the forwarded event (optional)
//
const forwardEvent = (from, to, eventName, newEventName = eventName) => {
  from.on(eventName, (...eventArgs) => {
    to.emit(newEventName, ...eventArgs);
  });
};

// Forward events from one EventEmitter to another.
//   from - EventEmitter to listen for event
//   to - EventEmitter to emit event on
//   eventNames - array of names of events
//
const forwardMultipleEvents = (from, to, eventNames) => {
  eventNames.forEach((event) => {
    forwardEvent(from, to, event);
  });
};

// Try to require `moduleName` and return the exported object if the module is
// found or null otherwise.
//
const safeRequire = (moduleName) => {
  try {
    return [null, require(moduleName)];
  } catch (err) {
    return [err, null];
  }
};

// Mixin source methods to target without overriding existing methods
// for ES6 classes.
//
const mixin = (target, source) => {
  Object.getOwnPropertyNames(source).forEach((property) => {
    if (!target[property]) {
      target[property] = source[property];
    }
  });
};

// If last element of the array args is a function then
// pops the array and returns that function else returns null.
//
const extractCallback = (args) => {
  if (typeof args[args.length - 1] === 'function') return args.pop();
  return null;
};

// This function can be used in contexts where a function (e.g., a callback) is
// required but no actions have to be done.
//
const doNothing = () => {};

// Splits string by the last occurrence of separator
//
const rsplit = (string, separator) => {
  const lastIndex = string.lastIndexOf(separator);
  if (lastIndex < 0) return [string];
  return [string.slice(0, lastIndex), string.slice(lastIndex + 1)];
};

module.exports = {
  forwardEvent,
  forwardMultipleEvents,
  safeRequire,
  mixin,
  extractCallback,
  doNothing,
  rsplit,
};
