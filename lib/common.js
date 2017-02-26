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
  from.on(eventName, (eventArgs) => {
    to.emit(newEventName, eventArgs, to);
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

// This function can be used in contexts where a function (e.g., a callback) is
// required but no actions have to be done.
//
common.doNothing = () => {};
