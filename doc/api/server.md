# Server

## Class: jstp.Server

JSTP server base class with necessary methods.
All of the transport servers extend this class.

### Event: 'connect'

- [`<Connection>`][connection]

Emitted when a JSTP connection is established and new session is created.

### Event: 'reconnect'

- [`<Connection>`][connection]

Emitted when a JSTP connection is established that is reusing existing
[session][session].

### Event: 'disconnect'

- [`<Connection>`][connection]

Emitted when a JSTP connection is closed.

### server.getClients()

- Returns: [`<Iterator>`][iterator]

Get all clients as an Iterator of [`Connection`][connection] instances.

### server.getClientsArray()

- Returns: [`<Connection[]>`][connection]

### server.updateApplications(applications)

- `applications` [`<Application[]>`][application] | [`Map`][map] New
  applications array or index obtained from
  [`jstp.createAppsIndex()`][createappindex].

Replaces set of applications/applications versions available when connecting to
the server.

### server.updateConnectionsApi()

This function updates application version for each connection.

It will update connection's application to the newest version in the range
requested by the client. For example, if the client requested `'1.1.x'` range
and was using version '1.1.1', it will be updated to the latest SemVer
compatible version in this range (e.g. `'1.1.2'`, but not `'1.2.x'`).
If no suitable version is found, the client will use its previous app version.

### server.broadcast(interfaceName, eventName, ...args)

- `interfaceName` [`<string>`][string]
- `eventName` [`<string>`][string]
- `...args` `<any>`

Send event to all of the clients connected to the server.

[connection]: ./connection.md#class-jstpconnection
[application]: ./application.md#class-jstpapplication
[session]: ./session.md
[createappindex]: ./application.md#jstpcreateappsindexapplications
[iterator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
