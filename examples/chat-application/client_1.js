'use strict';

// Require '@metarhia/jstp' if you run this example outside this repository
const jstp = require('../..');

const APP_NAME = 'chatApp';
const PORT = 3000;
const HOSTNAME = '127.0.0.1';

jstp.ws.connectAndInspect(
  APP_NAME,
  null,
  ['auth', 'chat'],
  {},
  `ws://${HOSTNAME}:${PORT}`,
  (error, connection, app) => {
    if (error) {
      console.error(error);
      return;
    }

    console.log(`Connected to ${APP_NAME}`);

    const username = 'user_1';
    const password = 'password_1';

    app.auth.register(username, password, error => {
      if (error) {
        console.error(error);
        return;
      }

      console.log('Registered');

      app.auth.login(username, password, error => {
        if (error) {
          console.error(error);
          return;
        }

        console.log(`Logged in as ${username}`);

        app.chat.on('message', (sender, message) =>
          console.log(`${sender}: ${message}`)
        );
      });
    });
  }
);
