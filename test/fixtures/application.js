'use strict';

const name = 'testApp';

const interfaces = {
  calculator: {
    answer(connection, callback) {
      callback(null, 42);
    },
    divide(connection, divided, divider, callback) {
      if (!divider) {
        callback(new Error('Zero division'));
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
  interfaces
};
