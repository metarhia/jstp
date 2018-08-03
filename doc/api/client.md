# Client

- [Object: Client](#object-client)
  - [Methods](#methods)
    - [connectPolicy(application, connection, callback)](#connectpolicyapplication-connection-callback)
  - [Properties](#properties)
    - [application](#application)
    - [heartbeatInterval](#heartbeatinterval)

## Object: Client

### Methods

#### connectPolicy(application, connection, callback)

- application: `Application` — JSTP Application to be exposed over connection.
- connection: [`Connection`](./connection.md#class-connection) —
  JSTP Connection.
- callback(error, connection)
  - error: `Error`.
  - connection: [`Connection`](./connection.md#class-connection) —
    established connection.

Optional,
[`new SimpleConnectPolicy().connect`](./simple-connect-policy.md#connectapp-connection-callback)
will be used if not provided.

### Properties

#### application

- Type: `Application`.

#### heartbeatInterval

- Type: `number`.
