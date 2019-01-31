# wss

## Object: jstp.wss

### jstp.wss.createServer(options\[, listener\])

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

For more details see [`jstp.ws.createServer()`][jstpwsserver].

[application]: ./application.md#class-jstpapplication
[authpolicy]: ./auth-policy.md
[createappindex]: ./application.md#jstpcreateappsindexapplications
[ssp]: ./session-storage-provider.md#interface-jstpsessionstorageprovider
[sssp]: ./simple-session-storage-provider.md#class-jstpsimplesessionstorageprovider
[serverconnect]: ./server.md#event-connect
[jstpwsserver]: ./ws.md#jstpwscreateserveroptions91-listener93
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
