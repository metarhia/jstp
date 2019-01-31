# tls

## Object: jstp.tls

### jstp.tls.connect(app, client, ...args, callback)

- `app` [`<string>`][string] | [`<Object>`][object] Application to connect to as
  `'name'` or `'name@version'` or `{ name, version }`, where version must be a
  valid semver range.
- `client` [`<Client>`][client] | [`<null>`][null] Optional, when omitted, an
  object with the default values for [`application`][clientapp],
  [`connectPolicy`][clientcp] and [`reconnector`][clientreconnector] is used.
- `...args` `<any>` Arguments passed directly to
  [`tls.connect()`][tlsconnect] (except for `callback`)
- `callback` [`<Function>`][function]
  - `error`: [`<Error>`][error]
  - `connection`: [`<Connection>`][connection]

### jstp.tls.connectAndInspect(app, client, interfaces, ...args, callback)

- `app` [`<string>`][string] | [`<Object>`][object] Application to connect to as
  `'name'` or `'name@version'` or `{ name, version }`, where version must be a
  valid semver range.
- `client` [`<Client>`][client] | [`<null>`][null] Optional, when omitted, an
  object with the default values for [`application`][clientapp],
  [`connectPolicy`][clientcp] and [`reconnector`][clientreconnector] is used.
- `interfaces` [`<string[]>`][string] Interface names to perform inspect on.
- `...args` `<any>` Arguments passed directly to
  [`tls.connect()`][tlsconnect] (except for `callback`)
- `callback` [`<Function>`][function]
  - `error`: [`<Error>`][error]
  - `connection`: [`<Connection>`][connection]
  - `proxies` [`<Object>`][object]
    - `[interfaceName]` [`<RemoteProxy>`][remoteproxy]

For more details see [`jstp.net.connectAndInspect()`][jstpnetconnectinspect].

### jstp.tls.reconnect(connection, ...args, callback)

- `connection`: [`<Connection>`][connection]
- `...args` `<any>` Arguments passed directly to
  [`tls.connect()`][tlsconnect] (except for `callback`)
- `callback` [`<Function>`][function]
  - `error`: [`<Error>`][error]
  - `connection`: [`<Connection>`][connection]

For more details see [`jstp.net.reconnect()`][jstpnetreconnect].

### jstp.tls.createServer(options\[, listener\])

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
[`tls.createServer()`][tlscreateserver]. However, beware, some of the options
may interfere with the correct functioning of the JSTP protocol.

For more details see [`jstp.net.createServer()`][jstpnetserver]

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
[serverconnect]: ./server.md#event-connect
[jstpnetconnectinspect]: ./net.md#jstpnetconnectandinspectapp-client-interfaces-args-callback
[jstpnetreconnect]: ./net.md#jstpnetreconnectconnection-args-callback
[jstpnetserver]: ./net.md#jstpnetcreateserveroptions91-listener93
[tlsconnect]: http://nodejs.org/api/tls.html#tls_tls_connect_options_callback
[tlscreateserver]: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
