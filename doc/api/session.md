# Session

## Class: jstp.Session

JSTP session class is used to buffer and resend the messages in case of
unexpected connection closes. It extends [`Map`][map] class and thus can be used
to store the current session state independently of connection.

### session.id

- [`<string>`][string]

UUID v4 identifier of the session.

### session.connection

- [`<Connection>`][connection]

Link to the connection that is currently used in this session.

### session.username

- [`<string>`][string]

The username that was used to log in for the first time in the session or
[`null`][null] if `'anonymous'` authentication strategy was used.

### session.toString()

- Returns: [`<string>`][string]

Converts `Session` object to string.

Must be used by implementers of [session storage providers][ssp] when exporting
the `Session` objects.

It is possible to lose some data due to this method using [JSON][json] for
serialization.

### Session.fromString(sessionString)

- `sessionString` [`<string>`][string]

Static method that restores Session object from string created by `toString()`
method.

Must be used by implementers of [session storage providers][ssp] when importing
the `Session` objects.

[connection]: ./connection.md#class-jstpconnection
[ssp]: ./session-storage-provider.md#interface-jstpsessionstorageprovider
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
[json]: https://developer.mozilla.org/en-US/docs/Glossary/JSON
