# ws for browser

This module is loaded instead of [`jstp.ws`][jstpws] when using the package in
browser.

## Object: jstp.ws

### jstp.ws.connect(app, client, url, callback)

- `app` [`<string>`][string] | [`<Object>`][object] Application to connect to as
  `'name'` or `'name@version'` or `{ name, version }`, where version must be a
  valid semver range.
- `client` [`<Client>`][client] | [`<null>`][null] Optional, when omitted, an
  object with the default values for [`application`][clientapp],
  [`connectPolicy`][clientcp] and [`reconnector`][clientreconnector] is used.
- `url` [`<string>`][string]
- `callback` [`<Function>`][function]
  - `error`: [`<Error>`][error]
  - `connection`: [`<Connection>`][connection]

### jstp.ws.connectAndInspect(app, client, interfaces, url, callback)

- `app` [`<string>`][string] | [`<Object>`][object] Application to connect to as
  `'name'` or `'name@version'` or `{ name, version }`, where version must be a
  valid semver range.
- `client` [`<Client>`][client] | [`<null>`][null] Optional, when omitted, an
  object with the default values for [`application`][clientapp],
  [`connectPolicy`][clientcp] and [`reconnector`][clientreconnector] is used.
- `interfaces` [`<string[]>`][string] Interface names to perform inspect on.
- `url` [`<string>`][string]
- `callback` [`<Function>`][function]
  - `error`: [`<Error>`][error]
  - `connection`: [`<Connection>`][connection]
  - `proxies` [`<Object>`][object]
    - `[interfaceName]` [`<RemoteProxy>`][remoteproxy]

For more details see [`jstp.net.connectAndInspect()`][jstpnetconnectinspect].

### jstp.ws.reconnect(connection, url, callback)

- `connection`: [`<Connection>`][connection]
- `url` [`<string>`][string]
- `callback` [`<Function>`][function]
  - `error`: [`<Error>`][error]
  - `connection`: [`<Connection>`][connection]

For more details see [`jstp.net.reconnect()`][jstpnetreconnect].

[client]: ./client.md#interface-jstpclient
[clientapp]: ./client.md#clientapplication
[clientcp]: ./client.md#clientconnectpolicyapplication-connection91-session93-callback
[clientreconnector]: ./client.md#clientreconnectorconnection-reconnectfn
[connection]: ./connection.md#class-jstpconnection
[remoteproxy]: ./remote-proxy.md#class-jstpremoteproxy
[jstpnetconnectinspect]: ./net.md#jstpnetconnectandinspectapp-client-interfaces-args-callback
[jstpnetreconnect]: ./net.md#jstpnetreconnectconnection-args-callback
[jstpws]: ./ws.md
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
