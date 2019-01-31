# RemoteProxy

## Class: jstp.RemoteProxy

Remote API proxy object class that extends [`EventEmitter`][eventemitter]. It
wraps remote methods so that they look like regular local methods and acts like
a remote event emitter.

Using `proxy.on()` you can subscribe to both local and remote events.

### Constructor: new RemoteProxy(connection, interfaceName\[, methods\])

- `connection` [`<Connection>`][connection]
- `interfaceName` [`<string>`][string]
- `methods` [`<string[]>`][string]

### proxy.emit(eventName, ...eventArgs)

- `eventName` [`<string>`][string]
- `...eventArgs` `<any>`

Emits event over the connection.

It also emits the event on the proxy instance.

### proxy\[methodName\](...args, callback\[, resend\])

- `methodName` [`<string>`][string]
- `...args` `<any>`
- `callback` [`<Function>`][function]
- `resend` [`<boolean>`][boolean] If set to true, call message will be resent if
  it is not possible to get a callback.

[connection]: ./connection.md#class-jstpconnection
[eventemitter]: http://nodejs.org/api/events.html#events_class_eventemitter
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
