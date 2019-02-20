'use strict';

// Require '@metarhia/jstp' if you run this example outside this repository
const jstp = require('../..');

const errors = {
  ERR_NOT_AUTHENTICATED: 1000,
  ERR_ALREADY_REGISTERED: 1001,
  ERR_INVALID_CREDENTIALS: 1002,
  ERR_ALREADY_AUTHENTICATED: 1003,
};

const users = new Map();

const auth = {
  register: (connection, username, password, callback) => {
    if (users.has(username)) {
      callback(errors.ERR_ALREADY_REGISTERED);
      return;
    }

    users.set(username, password);
    callback();
  },
  login: (connection, username, password, callback) => {
    if (connection.session.has('user')) {
      callback(errors.ERR_ALREADY_AUTHENTICATED);
      return;
    }

    const pass = users.get(username);

    if (!pass || pass !== password) {
      callback(errors.ERR_INVALID_CREDENTIALS);
      return;
    }

    connection.session.set('user', username);
    callback();
  },
};

const chat = {
  sendMessage: (connection, message, callback) => {
    const username = connection.session.get('user');

    if (!username) {
      callback(errors.ERR_NOT_AUTHENTICATED);
      return;
    }

    const { server } = connection;

    for (const conn of server.getClients()) {
      if (conn !== connection) {
        conn.emitRemoteEvent('chat', 'message', [username, message]);
      }
    }

    callback();
  },
};

const chatApp = new jstp.Application('chatApp', { auth, chat });

module.exports = chatApp;
