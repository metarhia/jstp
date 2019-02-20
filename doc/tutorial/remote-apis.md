# Remote APIs

JSTP allows you to use remote APIs as regular asynchronous functions, let's
examine how it looks like by updating our `client.js` file like this:

```javascript
'use strict';

const jstp = require('@metarhia/jstp');

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
      });
    });
  }
);
```

> The code added in callback at this step works both in Node.js and browser, so
> further we will consider only example in Node.js.

We've just added some output (all those `console.log()` statements) to
understand, what steps we've proceeded so far. Then, of course, we handle
errors, which can appear during an interaction. As you can see, remote methods
can be called as regular asynchronous functions. `app` object is a
[remote proxy][remoteproxy], which allows you to access interfaces and methods
like this:

```javascript
app.auth.register(username, password, error => {
  if (error) console.error(error);
});
```

Now make sure your server has started listening and run `client.js`. If no
error occurred, you will see this:

```sh
$ node client.js
Connected to chatApp
Registered
Logged in as user_1
```

As this is a chat application, it's preferable to have at least two users
connected to try out all of the functionality, so we recommend you to rename
this file to `client_1.js` and create new file `client_2.js`, which will contain
the same code as `client_1.js`, but with other credentials:

```javascript
const username = 'user_2';
const password = 'password_2';
```

If you run these files now, chat will have two users:

```sh
$ node client_1.js
Connected to chatApp
Registered
Logged in as user_1
```

```sh
$ node client_2.js
Connected to chatApp
Registered
Logged in as user_2
```

So we are ready to use remote events and exchange messages in our chat.

[remoteproxy]: ../api/remote-proxy.md#class-jstpremoteproxy
