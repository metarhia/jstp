# Connection

- [Class: Connection](#class-connection)
  - [new Connection(transport, server, client)](#new-connectiontransport-server-client)
  - [Methods](#methods)
    - [handshake(app, \[login\], \[password\], callback)](#handshakeapp-login-password-callback)
    - [inspectInterface(interfaceName, callback)](#inspectinterfaceinterfacename-callback)
    - [callMethod(interfaceName, methodName, args, callback)](#callmethodinterfacename-methodname-args-callback)
    - [emitRemoteEvent(interfaceName, eventName, args)](#emitremoteeventinterfacename-eventname-args)
    - [ping(callback)](#pingcallback)
    - [pong()](#pong)
    - [startHeartbeat(interval)](#startheartbeatinterval)
    - [stopHeartbeat()](#stopheartbeat)
    - [close()](#close)
    - [getTransport()](#gettransport)
  - [Properties](#properties)
    - [server](#server)
    - [client](#client)
    - [id](#id)
    - [remoteAddress](#remoteaddress)
    - [handshakeDone](#handshakedone)
    - [username](#username)
    - [sessionId](#sessionid)
    - [application](#application)
    - [remoteProxies](#remoteproxies)

## Class: Connection

### new Connection(transport, server, client)

- transport: `Transport`.
- server: `Server` — JSTP server instance, used only for server-side parts
  of connections (optional, but either server or client is required).
- client: [`Client`](./client.md#object-client) — JSTP client instance,
  used only for client-side parts of connections (optional,
  but either server or client is required).

Don't call this constructor manually unless you use custom tranport.
Recommended approach is to call `connect()` function provided by these modules:

- [net](./net.md#connectapp-client-options-callback)
- [tls](./tls.md#connectapp-client-options-callback)
- [ws](./ws.md#connectapp-client-options-callback)
- [ws-browser](./ws-browser.md#connectapp-client-options-callback)
- [wss](./wss.md#connectapp-client-options-callback)

### Methods

#### handshake(app, \[login\], \[password\], callback)

- app: `String || Object` — application to connect to as `'name'` or
  `'name@version'` or `{ name, version }`, where version must be
  a valid semver range.
- login: `String` — user name.
- password: `String` — user password.
- callback(error, sessionId) — callback function to invoke after the handshake
  is completed.
  - error: `Error`.
  - sessionId: `string`.

Send a handshake message over the connection.

#### inspectInterface(interfaceName, callback)

- interfaceName: `String` — name of an interface to inspect.
- callback(error, proxy) — callback function to invoke after another side
  responds to an interface introspection.
  - error: `Error`.
  - proxy: `RemoteProxy` — remote proxy for the interface.

Send an inspect message over the connection.

#### callMethod(interfaceName, methodName, args, callback)

- interfaceName: `String` — name of an interface.
- methodName: `String` — name of a method.
- args: `Array` — method arguments.
- callback(error, ...args) — callback function that is invoked after a callback
  message has been received.
  - error: `Error`.

Send a call message over the connection.

#### emitRemoteEvent(interfaceName, eventName, args)

- interfaceName: `String` — name of an interface.
- eventName: `String` — name of an event.
- args: `Array` — event arguments.

Send an event message over the connection.

#### ping(callback)

- callback(error, ...args) — callback function to invoke after another side
  responds with a pong message.
  - error: `Error`.

Send a ping message.

#### pong()

Send a pong message.

#### startHeartbeat(interval)

- interval: `number` — heartbeat interval in milliseconds.

Start sending heartbeat messages.

#### stopHeartbeat()

Stop sending heartbeat messages.

#### close()

Close the connection.

#### getTransport()

- Returns: `Transport`.

Returns underlying transport.

### Properties

#### server

- Type: `Server`.

#### client

- Type: [`Client`](./client.md#object-client).

#### id

- Type: `number`.

#### remoteAddress

- Type: `Object`.

#### handshakeDone

- Type: `boolean`.

#### username

- Type: `string`.

#### sessionId

- Type: `number`.

#### application

- Type: `Application`.

#### remoteProxies

- Type: `Map of RemoteProxy`.
