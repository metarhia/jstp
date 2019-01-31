# Client

## Interface: jstp.Client

Client object is used to specify client-side connection behavior.

### client.connectPolicy(application, connection\[, session\], callback)

- `application` [`<string>`][string] | [`<Object>`][object]
- `connection` [`<Connection>`][connection]
- `session` [`<Session>`][session]
- `callback` [`<Function>`][function]
  - `error` [`<Error>`][error] | [`<null>`][null]
  - `connection` [`<Connection>`][connection]
  - `session` [`<Session>`][session]

The `application` may be `'name'`, `'name@version'` or `{ name, version }`,
where version must be a valid semver range.

The `session` is passed to this function when the client is reconnecting to the
existing session.
In that case, implementations of this interface are not required to pass
`session` argument to the `callback`.

If this field is not set, [`new SimpleConnectPolicy().connect()`][scpconnect]
is used.

It is also possible to set this field to an object with the `connect()` method
having the same signature.

### client.application

- [`<Application>`][application]

Client-side application instance to be exposed over connection.

If this field is not set, an [`Application`][application] `jstp@1.0.0` with an
empty `api` is used.

### client.heartbeatInterval

- [`<number>`][number]

Setting this field enables heartbeat.

### client.session

- [`<Session>`][session]

Setting this field results in using the `'session'` authentication strategy
when connecting, which can be used to reconnect to the existing session.

### client.logger

- [`<EventEmitter>`][eventemitter]

Optional EventEmitter object to use for logging. If this field is not set,
logging events are emitted on the connection object itself. Available logging
events are listed in the [`Connection`][connection] class.

### client.reconnector(connection, reconnectFn)

- `connection` [`<Connection>`][connection]
- `reconnectFn` [`<Function>`][function]
  - `transport` [`<string>`][string] Optional argument, can be passed to switch
    transport on reconnection.
  - `...options` `<any>` Optional options to be passed to `transport.connect()`
    function.
  - `callback` [`<Function>`][function] Optional callback to be called after
    finishing the reconnection attempt.

When set, this function will be called after the connection is closed and can be
used to reconnect to the same or different server by calling `reconnectFn` and
providing options in the same way they are provided when connecting to the
server.

It is also possible to use another transport by providing its name as the first
argument to `reconnectFn`. In case no `transport` and/or `options` were provided
to `reconnectFn`, values from the previous successful connection attempt are to
be used.

To completely stop reconnecting do not call `reconnectFn` inside this function.

In case this field is not set, default reconnector that provides exponential
backoff functionality is used.

[application]: ./application.md#class-jstpapplication
[connection]: ./connection.md#class-jstpconnection
[session]: ./session.md
[scpconnect]: ./simple-connect-policy.md#simpleconnectpolicyconnectapp-connection-session-callback
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[eventemitter]: http://nodejs.org/api/events.html#events_class_eventemitter
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
