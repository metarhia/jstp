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
    return common.eitherRight(require(moduleName));
  } catch (err) {
    return new Either(err);
  }
};

// This function can be used in contexts where a function (e.g., a callback) is
// required but no actions have to be done.
//
common.doNothing = () => {};

// Either can be used for saving either left type or right type value.
// Left type is commonly used for additional information like error.
//
function Either(left, right) {
  if (left) {
    this.isLeft = true;
    this.val = left;
  } else {
    this.isLeft = false;
    this.val = right;
  }
}

common.Either = Either;

// Function for creating Either values with right type inside
//
common.eitherRight = right => (new Either(null, right));

// Alternative append for either values
//
common.altAppend = (e1, e2) => (!e1.isLeft ? e1 : e2);

// Alternative concatenation for either values
//
common.altConcat = (...args) => {
  switch (args.length) {
    case 0: throw new Error('altConcat takes one or more arguments');
    case 1: return args[0];
    default: {
      let res = args[0];
      let i;
      for (i = 1; i < args.length; i++) {
        res = common.altAppend(res, args[i]);
      }
      return res;
    }
  }
};

// Alternative lazy concatenation for either values
//
common.altConcatLazy = (...args) => {
  switch (args.length) {
    case 0: throw new Error('altConcat takes one or more arguments');
    case 1: return args[0]();
    default: {
      let res = args[0]();
      let i;
      for (i = 1; i < args.length; i++) {
        res = common.altAppend(res, args[i]());
      }
      return res;
    }
  }
};

// Takes function for processing left type value
// and another one for right type and executes suitable one
//
common.either = (leftFn, rightFn, valE) => (
  valE.isLeft ? leftFn(valE.val) : rightFn(valE.val)
);
