# Initializing a server

After we've created the application, we are ready to initialize a server for it.

Let's create a `server.js` file in our project directory:

```javascript
'use strict';

const jstp = require('@metarhia/jstp');
const chatApp = require('./chatApp');

const PORT = 3000;
const server = jstp.ws.createServer([chatApp]);

server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
```

In this example we are using WebSocket as a transport, other available
transports are TCP and Unix domain sockets, secure transports like WebSocket
Secure and TLS are also supported.

Here we have passed an array of applications (in our case just one chat app) to
[`createServer`][createserver] because JSTP server can serve multiple
applications. As we've chosen WebSocket as transport, `jstp.ws` module is used.

```javascript
const server = jstp.ws.createServer([chatApp]);
```

At the next step, the server starts listening on the specified port and is ready
to accept connections. The second argument is automatically set as a listener
for the server's `'listening'` event, which will be emitted when the server
will have been bound.

```javascript
server.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
```

For additional information [`jstp.Server`][server] in API Documentation.

Now you can start your server and see something like this:

```sh
$ node server.js
Server listening on port 3000...
```

So let's now look into how we can connect to the server and work with remote
APIs.

[server]: ../api/server.md#class-jstpserver
[createserver]: ../api/ws.md#jstpwscreateserveroptions-listener
