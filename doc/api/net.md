# net

## Object: jstp.net

### jstp.net.connect(app, client, ...args, callback)

- `app` [`<string>`][string] | [`<Object>`][object] Application to connect to as
  `'name'` or `'name@version'` or `{ name, version }`, where version must be a
  valid semver range.
- `client` [`<Client>`][client] | [`<null>`][null] Optional, when omitted, an
  object with the default values for [`application`][clientapp],
  [`connectPolicy`][clientcp] and [`reconnector`][clientreconnector] is used.
- `...args` `<any>` Arguments passed directly to
  [`net.connect()`][netconnect] (except for `connectListener`)
- `callback` [`<Function>`][function]
  - `error`: [`<Error>`][error]
  - `connection`: [`<Connection>`][connection]

### jstp.net.connectAndInspect(app, client, interfaces, ...args, callback)

- `app` [`<string>`][string] | [`<Object>`][object] Application to connect to as
  `'name'` or `'name@version'` or `{ name, version }`, where version must be a
  valid semver range.
- `client` [`<Client>`][client] | [`<null>`][null] Optional, when omitted, an
  object with the default values for [`application`][clientapp],
  [`connectPolicy`][clientcp] and [`reconnector`][clientreconnector] is used.
- `interfaces` [`<string[]>`][string] Interface names to perform inspect on.
- `...args` `<any>` Arguments passed directly to
  [`net.connect()`][netconnect] (except for `connectListener`).
- `callback` [`<Function>`][function]
  - `error`: [`<Error>`][error]
  - `connection`: [`<Connection>`][connection]
  - `proxies` [`<Object>`][object]
    - `[interfaceName]` [`<RemoteProxy>`][remoteproxy]

Connects to the server and sends `'inspect'` messages for the requested
interfaces.
In case all of the inspect calls were successful, an object containing remote
proxies is returned.

It is possible, when using this method, to get an error
[`jstp.ERR_INTERFACE_NOT_FOUND`][inspecterr] passed to the `callback` due to
some of the `'inspect'` calls failing, and still receive a usable `connection`
object.

### jstp.net.reconnect(connection, ...args, callback)

- `connection`: [`<Connection>`][connection]
- `...args` `<any>` Arguments passed directly to
  [`net.connect()`][netconnect] (except for `connectListener`)
- `callback` [`<Function>`][function]
  - `error`: [`<Error>`][error]
  - `connection`: [`<Connection>`][connection]

This method can be used to reconnect to the same session without switching to
the new [`Connection`][connection] instance.

At the moment, when using this on a still alive connection, server
implementation provided by this package closes the previous network connection
on its side, but in general, it is not recommended to use this method on such
connections, since there is no guarantee that the server will close the already
existing network connection during reconnection and thus it may result in a
dangling network connection.

### jstp.net.createServer(options\[, listener\])

- `options` [`<Object>`][object] | [`<Application[]>`][application]
  - `applications` [`<Application[]>`][application] | [`Map`][map] Applications
    array or index obtained from [`jstp.createAppsIndex()`][createappindex].
  - `authPolicy` [`<AuthPolicy>`][authpolicy] | [`<Function>`][function] If the
    function is provided, it is expected to have the same signature as
    `AuthPolicy.authenticate()`.
  - `sessionStorageProvider` [`<SessionStorageProvider>`][ssp] If provided,
    this is used to store sessions for applications that do not have its own
    storage provider. Defaults to using [`SimpleSessionStorageProvider`][sssp]
    with its default settings.
  - `heartbeatInterval` [`<number>`][number] Omitting this option disables
    heartbeat.
  - `clientExpirationTime` [`<number>`][number] Time it takes for client's
    connection and corresponding session cache, stored in memory after the
    connection is closed, to expire. Defaults to `3600000` (1 hour).
- `listener` [`<Function>`][function] Automatically set as a listener for the
  [`'connect'`][serverconnect] event.

For additional options see documentation for
[`net.createServer()`][netcreateserver]. However, beware, some of the options
may interfere with the correct functioning of the JSTP protocol.

`authPolicy` is used whenever the handshake with authentication strategy other
than `'anonymous'` or `'session'` is received. In case it is omitted from the
options, using any other strategy will result in
[`jstp.ERR_AUTH_FAILED`][autherr] error.

[application]: ./application.md#class-jstpapplication
[authpolicy]: ./auth-policy.md
[client]: ./client.md#interface-jstpclient
[clientapp]: ./client.md#clientapplication
[clientcp]: ./client.md#clientconnectpolicyapplication-connection91-session93-callback
[clientreconnector]: ./client.md#clientreconnectorconnection-reconnectfn
[connection]: ./connection.md#class-jstpconnection
[createappindex]: ./application.md#jstpcreateappsindexapplications
[ssp]: ./session-storage-provider.md#interface-jstpsessionstorageprovider
[sssp]: ./simple-session-storage-provider.md#class-jstpsimplesessionstorageprovider
[remoteproxy]: ./remote-proxy.md#class-jstpremoteproxy
[inspecterr]: ./errors.md#jstperr_interface_not_found
[autherr]: ./errors.md#jstperr_auth_failed
[serverconnect]: ./server.md#event-connect
[netconnect]: http://nodejs.org/api/net.html#net_net_connect
[netcreateserver]: http://nodejs.org/api/net.html#net_net_createserver_options_connectionlistener
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
