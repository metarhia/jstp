# SimpleConnectPolicy

## Class: jstp.SimpleConnectPolicy

Simple generic connection provider. Used for client-side connection.
Sends handshake with login/password or session ID if provided, otherwise sends
anonymous handshake. You are free to implement whatever suits your needs
instead.

### simpleConnectPolicy.connect(app, connection\[, session], callback)

- `app` [`<string>`][string] | [`<Object>`][object] application to connect to as
  `'name'` or `'name@version'` or `{ name, version }`, where version must be a
  valid semver range.
- `connection` [`<Connection>`][connection]
- `session` [`<Session>`][session]
- `callback` [`<Function>`][function]
  - `error` [`<Error>`][error] | [`<null>`][null]
  - `connection` [`Connection`][connection]

Should send handshake message with appropriate credentials. You can get client
object provided upon connection creation with `connection.client`.

[connection]: ./connection.md#class-jstpconnection
[session]: ./session.md
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
