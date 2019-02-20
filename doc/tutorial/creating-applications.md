# Creating applications

First of all, let's create an application, which will be the basis of our future
server API. The [`Application`][application] is the core high-level abstraction
of the framework. Every application can consist of a number of interfaces,
each of which has its methods.

For this tutorial, we will create a pretty straightforward chat application
with two interfaces: `auth` and `chat`. The API will be quite plain with an
expected scenario like this:

1. User registers a username and password if there is no "account" yet
2. User logins with valid credentials
3. Then the user can send messages to all connected users and receive messages
   from others

For the sake of simplicity we won't use a real database here for storing
users' credentials or any cryptographic techniques for security, which you
probably would implement in real projects, because our primary goal is to show
the basic principles of using JSTP and don't get distracted by implementing
a lot of other unrelated functionality.

Let's create a `chatApp.js` file in our project directory:

```javascript
'use strict';

const jstp = require('@metarhia/jstp');

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
```

This code may raise some questions, so let’s go over it to see how it works.

After requiring `jstp` module, we created an object to map error names to their
codes and return them to client in case something went wrong.

```javascript
const errors = {
  ERR_NOT_AUTHENTICATED: 1000,
  ERR_ALREADY_REGISTERED: 1001,
  ERR_INVALID_CREDENTIALS: 1002,
  ERR_ALREADY_AUTHENTICATED: 1003,
};
```

Next, we created a [`Map`][map] for users' credentials, which emulates a real
project database. Here we'll store user names and passwords, when they register.

```javascript
const users = new Map();
```

After these preparatory steps, we are ready to implement two interfaces for
the chat application: `auth` interface with the `register` and `login`
methods and `chat` with method `sendMessage`. This example API is quite
simplified, and its implementation only shows the main purpose of methods,
so we won't examine them in detail.

> Note that first argument of every method in interfaces is always
> [`connection`][connection] and last is always callback with error first
> contract, so that error (or `null` if there is no error) and all the results
> will be returned in it.

There is one more thing you can be curious about -
[`connection.session`][session], which extends [`Map`][map] class and thus
can be used to store the current session state independently of connection.
For example, in `auth` interface's `login` method after the user logged in,
we just set key `'user'` to `username` value in current client session to check
later if the user has been authorized.

```javascript
connection.session.set('user', username);
```

Further in `chat` interface's `sendMessage` method we access connection's
[`server`][server] so that we can get all server's client connections. For each
of them, we send the given message and the username of the sender by emitting a
remote event in their connections (more about [remote events][remoteevents]):

```javascript
const { server } = connection;

for (const conn of server.getClients()) {
  if (conn !== connection) {
    conn.emitRemoteEvent('chat', 'message', [username, message]);
  }
}
```

> An alternative way to send a message for all other connected users in chat is
> to use [`server.broadcast()`][serverbroadcast] method:

```javascript
const { server } = connection;
server.broadcast('chat', 'message', username, message);
```

> In this case, you should check in client event handler (more about this
> [here][remoteevents]) if the sender's username is not client's username
> because the server will send the event message to all of the connected clients
> and we don't want to receive our messages back.

After we've implemented interfaces, we are ready to create our chat application:

```javascript
const chatApp = new jstp.Application('chatApp', { auth, chat });
```

> JSTP supports multiple versions per server [`application`][application],
> application name should contain version after '@' (e.g. app@1.0.0). As we
> don't specify the version in our app, the default `1.0.0` is used.

So we've just created a simple [`application`][application] with some basic
interfaces for our future server, which will be created at the next step.

[remoteevents]: ./remote-events.md
[server]: ../api/server.md#class-jstpserver
[session]: ../api/session.md#class-jstpsession
[connection]: ../api/connection.md#class-jstpconnection
[application]: ../api/application.md#class-jstpapplication
[serverbroadcast]: ../api/server.md#serverbroadcastinterfacename-eventname-args
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
