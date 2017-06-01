'use strict';

const name = 'testApp';
const expectedErrorMessage = 'Zero division';
const interfaces = {
  calculator: {
    answer(connection, callback) {
      callback(null, 42);
    },
    divide(connection, divided, divider, callback) {
      if (!divider) {
        callback(new Error(expectedErrorMessage));
      } else {
        callback(null, divided / divider);
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
