'use strict';

const consoleLogger = {};

const logMapping = [
  ['debug', 'log'], ['verbose', 'log'], 'info', 'warn', 'error'
];
logMapping.forEach((mapping) => {
  let from, to;
  if (Array.isArray(mapping)) {
    [from, to] = mapping;
  } else {
    from = to = mapping;
  }
  consoleLogger[from] = (...args) => console[to](...args);
});

module.exports = consoleLogger;
