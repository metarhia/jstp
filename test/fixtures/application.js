'use strict';

const name = 'testApp';
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
    }
  }
};

module.exports = {
  name,
  interfaces,
  expectedErrorMessage
};
