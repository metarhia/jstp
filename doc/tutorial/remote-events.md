# Remote events

## Emit remote events

### `Connection.emitRemoteEvent()`

For implementing a simple chat, where one user can send a message to other
connected ones, we've made an interface `chat` in `chatApp` application.

```javascript
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
```

Now we are focused on one line in this piece of code:

```javascript
conn.emitRemoteEvent('chat', 'message', [username, message]);
```

JSTP gives us an ability to work not only with remote methods but also with
remote events. So in this line, we are emitting remote event `message` in `chat`
interface for all connections (except for the connection sending the message).

### Remote proxy

As remote proxies, which you accept in callback in `connectAndInspect()`, are
also `EventEmitter`s, they can be used to `.emit()` remote events. Thus you can
emit an event to another side of a connection like this:

```javascript
app.someInterface.emit('someEvent', ...args);
```

where `app` is a remote proxy, and `someInterface` is the interface you've
inspected.

## Subscribe to remote event

### `Connection event: 'event'`

We can add these lines to `client_1.js` and `client_2.js`:

```javascript
connection.on('event', (interfaceName, eventName, [sender, message]) => {
  if (interfaceName === 'chat' && eventName === 'message') {
    console.log(`${sender}: ${message}`);
  }
});
```

So that source code of `client_1.js` for example will look like this:

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

        connection.on('event', (interfaceName, eventName, [sender, msg]) => {
          if (interfaceName === 'chat' && eventName === 'message') {
            console.log(`${sender}: ${msg}`);
          }
        });
      });
    });
  }
);
```

So, we are now subscribed to the event `message` in the `chat` interface. Every
time, when someone in chat sends a message, it will be printed on the screen.

It seems that everything works now, but the code is a little bit messy, thus
there is a much prettier way to do this.

### Remote proxy

As remote proxies are also `EventEmitter`s, they can listen to remote events
using `.on()`.

Let's update `client_1.js` and `client_2.js` in this way:

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

        app.chat.on('message', (sender, message) =>
          console.log(`${sender}: ${message}`)
        );
      });
    });
  }
);
```

We add these lines, which do the same thing as in the previous example, but
more gracefully:

```javascript
app.chat.on('message', (sender, message) =>
  console.log(`${sender}: ${message}`)
);
```

In the source code for this tutorial, this way to subscribe to events will be
used.

### Application event handlers

When we have established a client connection, the second argument in
`connectAndInspect()` was `null` because we did not need it at that time. Let's
assume that we need an application in client for full-duplex RPC.

Let's update `client_1.js` and `client_2.js`:

```javascript
'use strict';

const jstp = require('@metarhia/jstp');

const APP_NAME = 'chatApp';
const PORT = 3000;
const HOSTNAME = '127.0.0.1';

const eventHandlers = {
  chat: {
    message: (conn, sender, msg) => console.log(`${sender}: ${msg}`),
  },
};

const clientApp = new jstp.Application('clientApp', {}, eventHandlers);
const client = { application: clientApp };

jstp.ws.connectAndInspect(
  APP_NAME,
  client,
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

We have added a client application here with the name `clientApp`, empty object
as interfaces (because we won't add this functionality to a client application
for now) and `eventHandlers`, which will handle `message` event in `chat`
interface. Event handlers always accept the connection as a first argument,
next are arguments, which have been emitted.

```javascript
const eventHandlers = {
  chat: {
    message: (conn, sender, msg) => console.log(`${sender}: ${msg}`),
  },
};

const clientApp = new jstp.Application('clientApp', {}, eventHandlers);
const client = { application: clientApp };
```

Then we pass this client object to `connectAndInspect()`, so that client
application will handle specified events that will be emitted in within
connection. Event handlers can be specified for any application - on the client
side as well as on the server side.
