# AuthPolicy

## Interface: jstp.AuthPolicy

### authPolicy.authenticate(connection, application, strategy, credentials, callback)

- `connection` [`<Connection>`][connection]
- `application` [`<Application>`][application]
- `strategy` [`<string>`][string]
- `credentials` [`<Array>`][array]
- `callback` [`<Function>`][function]
  - `error` [`<Error>`][error]
  - `username` [`<string>`][string]

[connection]: ./connection.md#class-jstpconnection
[application]: ./application.md#class-jstpapplication
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
