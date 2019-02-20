# Example: chat application

At this point, we have implemented all of the functionality for a simple chat
application, which gives us an ability to:

1. Register users
2. Login users with valid credentials
3. Exchange messages between users

Let's send a message after login in [`client_2.js`][client2].

```javascript
app.chat.sendMessage(`hello from ${username}`, err => {
  if (err) console.error(err);
});
```

Now start server:

```sh
$ node server.js
Server listening on port 3000...
```

Then in one terminal run `client_1.js`:

```sh
$ node client_1.js
Connected to chatApp
Registered
Logged in as user_1
```

And in a separate terminal start `client_2.js`:

```sh
$ node client_2.js
Connected to chatApp
Registered
Logged in as user_2
```

After that in the terminal, where `client_1.js` runs, you will see this message,
as we have sent a message from user_2 to all connected users:

```sh
user_2: hello from user_2
```

You can check out the complete source code in our [repository][repository]

[repository]: https://github.com/metarhia/jstp/tree/master/examples/chat-application
[client2]: https://github.com/metarhia/jstp/tree/master/examples/chat-application/client_2.js
