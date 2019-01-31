# Connection

## Class: jstp.Connection

### Constructor: new Connection(transport, server, client)

- `transport` [`<Transport>`][transport]
- `server` [`<Server>`][server]
- `client` [`<Client>`][client]

Either `server` or `client` must be provided, but not both.
`server` is required for server side connection, whereas `client` is required
for client side connection.

You **should not** call this constructor manually,
unless you implement a custom JSTP transport.

Recommended approach is to call `connect()` or `connectAndInspect()` functions
provided by these modules:

- [net](./net.md)
- [tls](./tls.md)
- [ws](./ws.md)
- [ws-browser](./ws-browser.md)
- [wss](./wss.md)

### Event: 'reconnectAttempt'

- `transport` [`<string>`][string] Transport name.
- `...options` `<any>` Options passed to `transport.connect()`.

Client-side only event emitted before attempting the reconnection.

### Event: 'reconnect'

- `error` [`<Error>`][error] | [`<null>`][null] The error that occurred during
  reconnection if any.

Client-side only event emitted after the reconnection attempt.

### Event: 'client'

- `session` [`<Session>`][session]
- `connection` [`<Connection>`][connection]

Server-side only event emitted on successful session creation or restoration.

### Event: 'call'

- `interfaceName` [`<string>`][string]
- `methodName` [`<string>`][string]
- `args` [`<Array>`][array]

Logging event emitted when a 'call' message is received.

Logging events are not emitted when there is a dedicated logger specified in
the client object.

### Event: 'callback'

- `error` [`<Array>`][array]
- `ok` [`<Array>`][array]

Logging event emitted when a 'callback' message is received.

### Event: 'event'

- `interfaceName` [`<string>`][string]
- `eventName` [`<string>`][string]
- `args` [`<Array>`][array]

Logging event emitted when an 'event' message is received.

### Event: 'handshake'

- `error` [`<Array>`][array]
- `ok` [`<string>`][string] | [`<number>`][number] Session ID if the session
  was created or count of the messages received by the other side if the
  session is restored.

Logging event emitted when a 'handshake' message response is received.

### Event: 'heartbeat'

- `message` [`<Object>`][object] Empty object.

Logging event emitted when an old style (`'{}\0'`) heartbeat message is
received.

Emitted only when `process.env.NODE_ENV !== 'production'`.

### Event: 'incomingMessage'

- `message` [`<Object>`][object] Message object.

Logging event emitted when a message is received.

Emitted only when `process.env.NODE_ENV !== 'production'`.

### Event: 'outgoingMessage'

- `message` [`<Object>`][object] Message object.

Logging event emitted when a message is sent.

Emitted only when `process.env.NODE_ENV !== 'production'`.

### Event: 'inspect'

- `intefaceName` [`<string>`][string]

Logging event emitted when an 'inspect' message is received.

### Event: 'messageRejected'

- `message` [`<Object>`][object] Message object.

Logging event emitted when a message is rejected.

### connection.handshake(app\[, session\], callback)

- `app` [`<string>`][string] | [`<Object>`][object]
  - `name` [`<string>`][string]
  - `version` [`<string>`][string]
- `session` [`<Session>`][session]
- `callback` [`<Function>`][function]
  - `error` [`<RemoteError>`][remoteerror]
  - `sessionId` [`<string>`][string]

`app` may be `'name'`, `'name@version'` or `{ name, version }`,
where version must be a valid semver range.

Send a handshake message over the connection.

When `session` is provided, uses `'session'` authentication strategy,
`'anonymous'` authentication strategy is used otherwise.

### connection.handshake(app, login, password, callback)

- `app` [`<string>`][string] | [`<Object>`][object]
  - `name` [`<string>`][string]
  - `version` [`<string>`][string]
- `login` [`<string>`][string]
- `password` [`<string>`][string]
- `callback` [`<Function>`][function]
  - `error` [`<RemoteError>`][remoteerror]
  - `sessionId` [`<string>`][string]

`app` may be `'name'`, `'name@version'` or `{ name, version }`,
where version must be a valid semver range.

Send a handshake message over the connection using `'login'` authentication
strategy.

### connection.inspectInterface(interfaceName, callback)

- `interfaceName` [`<string>`][string]
- `callback` [`<Function>`][function]
  - `error` [`<RemoteError>`][remoteerror]
  - `proxy` [`<RemoteProxy>`][remoteproxy]

Send an inspect message over the connection.

### connection.callMethod(interfaceName, methodName, args, callback)

- `interfaceName` [`<string>`][string]
- `methodName` [`<string>`][string]
- `args` [`<Array>`][array]
- `callback` [`<Function>`][function]
  - `error` [`<RemoteError>`][remoteerror]
  - `...args` [`<Array>`][array]

Send a call message over the connection.

### connection.callMethodWithResend(interfaceName, methodName, args, callback)

- `interfaceName` [`<string>`][string]
- `methodName` [`<string>`][string]
- `args` [`<Array>`][array]
- `callback` [`<Function>`][function]
  - `error` [`<RemoteError>`][remoteerror]
  - `...args` [`<Array>`][array]

Send a call message over the connection resending if not possible to get a
callback.

### connection.emitRemoteEvent(interfaceName, eventName, args)

- `interfaceName` [`<string>`][string]
- `eventName` [`<string>`][string]
- `args` [`<Array>`][array]

Send an event message over the connection.

### connection.ping(callback)

- `callback` [`<Function>`][function]

Send a ping message.

### connection.startHeartbeat(interval)

- `interval` [`<number>`][number]

Start periodically sending ping messages every `interval` milliseconds.

### connection.stopHeartbeat()

Stop periodically sending ping messages.

### connection.close()

Close the connection.

### connection.getTransport()

- Returns: [`<Transport>`][transport]

Returns underlying transport.

### connection.server

- [`<Server>`][server]

### connection.client

- [`<Client>`][client]

### connection.id

- [`<number>`][number]

Unique for this process connection identifier.

### connection.remoteAddress

- `<any>`

Value obtained from `connection.getTransport().remoteAddress`.

### connection.handshakeDone

- [`<boolean>`][boolean]

### connection.username

- [`<string>`][string]

May be [`null`][null] if connection was established without logging in.

### connection.session

- [`<Session>`][session]

### connection.application

- [`<Application>`][application]

### connection.remoteProxies

- [`<Object>`][object]
  - `[interfaceName]` [`<RemoteProxy>`][remoteproxy]

[application]: ./application.md#class-jstpapplication
[transport]: ./transport.md
[server]: ./server.md
[client]: ./client.md#interface-jstpclient
[session]: ./session.md
[remoteerror]: ./errors.md#class-jstpremoteerror
[remoteproxy]: ./remote-proxy.md
[connection]: #class-jstpconnection
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
