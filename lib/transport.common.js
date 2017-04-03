'use strict';

var common = {};
module.exports = common;

// Check if the client is in the connected state and throw an error otherwise
//
common.ensureClientConnected = function(client) {
  if (!client.isConnected) {
    throw new Error('Not connected yet');
  }
};
