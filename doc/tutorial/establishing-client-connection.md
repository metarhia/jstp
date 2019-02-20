# Establishing client connection

When the server is ready, we can finally establish a client connection and
connect to `chatApp` application.

## Node.js

We need to create a `client.js` file in our project directory:

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

    // further interaction with connection and app goes here
  }
);
```

Let's go over this file line by line.

After requiring the `jstp` module, we prepare some constants as connection
options. We run the server locally on 3000 port, so `HOSTNAME` is `127.0.0.1`
(or `localhost` can also be used) and `PORT` is `3000` respectively:

```javascript
const APP_NAME = 'chatApp';
const PORT = 3000;
const HOSTNAME = '127.0.0.1';
```

Then we use the WebSocket module in `jstp` to connect to our chat application:

```javascript
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

    // further interaction with connection and app goes here
  }
);
```

The first argument is the name of the application to connect to, and the second
is the [`client`][client] object, which in our case is set to `null` and thus
will be replaced with the default client config.

> Note that the default value for the `application` field in the
> [`client`][client] object (when either the field or the [`client`][client] is
> omitted) is an application named `jstp@1.0.0` with an empty `api`. Check out
> [this example][clientapplication] to see how to replace it with your custom
> application. Using the [`client`][client] object you can also specify other
> client-side connection options.

The next argument is an array of interfaces to inspect after the successful
handshake - `auth` and `chat` in our case.

```javascript
['auth', 'chat'];
```

After that goes WebSocket client configuration (just empty object here),
request URL and the last argument is a callback to be called on successful
connection or error. For more information on connection options check out
[jstp.ws.connectAndInspect()][wsconnectandinspect] in API Documentation.

## Browser

Let's create an `index.html` file in our project directory:

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/@metarhia/jstp@latest/dist/jstp.umd.js"></script>
  </head>
  <body>
    <script>
      const APP_NAME = 'chatApp';
      const PORT = 3000;
      const HOSTNAME = '127.0.0.1';

      api.jstp.ws.connectAndInspect(
        APP_NAME,
        null,
        ['auth', 'chat'],
        `ws://${HOSTNAME}:${PORT}`,
        (error, connection, app) => {
          if (error) {
            console.error(error);
            return;
          }

          // further interaction with connection and app goes here
        }
      );
    </script>
  </body>
</html>
```

As you can see, the principle of connecting to the application from the browser
is very similar to connecting from Node.js, except that in the browser we don't
have to specify web socket client configuration (see [ws for browser][wsbrowser]
for more information).

In the next section, we are going to explore how to interact with remote APIs.

[client]: ../api/client.md#interface-jstpclient
[clientapplication]: ./remote-events.md#application-event-handlers
[wsbrowser]: ../api/ws-browser.md#object-jstpws
[wsconnectandinspect]: ../api/ws.md#jstpwsconnectandinspectapp-client-interfaces-websocketconfig-requesturl-callback
