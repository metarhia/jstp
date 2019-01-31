# SessionStorageProvider

## Interface: jstp.SessionStorageProvider

This interface describes the storage provider for [`Session`][session] objects
that may be used to persistently store sessions. Implementations may be
synchronous or asynchronous.

There is a default implementation provided in this package:
[`jstp.SimpleSessionStorageProvider`][sssp] that stores all of the session data
in memory and supports session expiration.

### ssp.isAsync()

- Returns: [`<boolean>`][boolean]

The return value of this function is used to determine if the implementation of
the provider is asynchronous.

### ssp.get(sessionId\[, callback\])

- `sessionId` [`<string>`][string]
- `callback` [`<Function>`][function]
- Returns: [`<Session>`][session] | [`<undefined>`][undefined]

Must return the Session object with the corresponding session ID
or `undefined` if the session cannot be found.

This method is called at most once for each connection on handshake, in case of
session restoring when there is no connection associated with the session
available in the server's cache (see `clientExpirationTime` option in
[`jstp.net.createServer()`][createserver]).

If the session storage provider is asynchronous, it is expected to pass the
`Session` object to the callback instead of returning it from the function.

### ssp.set(sessionId, session)

- `sessionId` [`<string>`][string]
- `session` [`<Session>`][session]

Must save the Session object with the corresponding session ID.

This method is called every time when connection associated with
the session is being closed.

### ssp.setInactive(sessionId)

- `sessionId` [`<string>`][string]

Optional method, can be omitted if this functionality is not required.

If provided, must mark the session as inactive.

Called whenever the connection associated with the session is being closed.

[sssp]: ./simple-session-storage-provider.md
[session]: ./session.md
[createserver]: ./net.md#jstpnetcreateserveroptions91-listener93
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[undefined]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type
