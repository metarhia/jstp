# tls

- [connect(app, client, ...options, \[callback\])](#connectapp-client-options-callback)

## connect(app, client, ...options, \[callback\])

- app: `String || Object` — application to connect to as `'name'` or
  `'name@version'` or `{ name, version }`, where version must be
  a valid semver range.
- client: [`Client`](./client.md#object-client) — JSTP client instance, used
  only for client-side parts of connections (optional, but either server or
  client is required).
- options: `Object` — will be destructured and passed directly to `connFactory`.
- callback(error, connection) — Optional callback that will be called when
  connection is established.
  - error: `Error`.
  - connection: [`Connection`](./connection.md#class-connection).
