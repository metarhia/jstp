# Simple Connect Policy

- [Class: SimpleConnectPolicy](#class-simpleconnectpolicy)
  - [Methods](#methods)
    - [connect(app, connection, callback)](#connectapp-connection-callback)

## Class: SimpleConnectPolicy

Simple generic connection provider. Used for client-side connection.
Sends handshake with login/password if provided otherwise sends
anonymous handshake.
You are free to implement whatever suits your needs instead.

### Methods

#### connect(app, connection, callback)

- app: `String || Object` — application to connect to as `'name'` or
  `'name@version'` or `{ name, version }`, where version must be
  a valid semver range.
- connection: [`Connection`](./connection.md#class-connection).
- callback(error, connection)
  - error: `Error`.
  - connection: [`Connection`](./connection.md#class-connection).

Should send handshake message with appropriate credentials. You can get client
object provided upon connection creation with `connection.client`.
