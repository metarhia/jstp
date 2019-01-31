# Application

## Class: jstp.Application

Generic application class. You are free to substitute it with other class with
the same interface that suits your needs.

### Constructor: new Application(name, api\[, eventHandlers\[, version\]\[, ssp\]\])

- `name` [`<string>`][string] Application name that may contain version after
  '@' (e.g. app@1.0.0). Version in name is preferred over 'version' parameter.
- `api` [`<Object>`][object]
  - `[interfaceName]` [`<Object>`][object] Keys with the arbitrary names that
    will be used as the remote interface names.
    - `[methodName]` [`<Function>`][function] Keys with the arbitrary names
      that will be used as the remote method names.
      - `connection` [`<Connection>`][connection]
      - `...args` `<any>`
      - `callback` [`<Function>`][function]
- `eventHandlers` [`<Object>`][object]
  - `[interfaceName]` [`<Object>`][object] Keys with the arbitrary names that
    will be used as the remote interface names.
    - `[eventName]` [`<Function>`][function] Keys with the arbitrary names that
      will be used as the remote event names.
      - `connection` [`<Connection>`][connection]
      - `...args` `<any>`
- `version` [`<string>`][string] If a version is not provided either here or in
  `name`, `1.0.0` is used.
- `ssp` [`<SessionStorageProvider>`][ssp] If provided, it is used to store
  sessions independently of other applications.

### application.callMethod(connection, interfaceName, methodName, args, callback)

- `connection` [`<Connection>`][connection]
- `interfaceName` [`<string>`][string]
- `methodName` [`<string>`][string]
- `args` [`<Array>`][array]
- `callback` [`<Function>`][function]

This method is called when handling incoming `'call'` message.

### application.getMethods(interfaceName)

- `interfaceName` [`<string>`][string] Name of the interface to inspect.
- Returns: [`<string[]>`][string] Array of method names of the interface.

This method is called when handling incoming `'inspect'` message.

### application.handleEvent(connection, interfaceName, eventName, args)

- `connection` [`<Connection>`][connection]
- `interfaceName` [`<string>`][string]
- `eventName` [`<string>`][string]
- `args` [`<Array>`][array]

This method is called when handling incoming `'event'` message.

## jstp.createAppsIndex(applications)

- `applications` [`<Application[]>`](#class-jstpapplication)
- Returns: [`<Map>`][map] Created index.

Create an index of applications from an array.

[connection]: ./connection.md#class-jstpconnection
[ssp]: ./session-storage-provider.md#interface-jstpsessionstorageprovider
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
