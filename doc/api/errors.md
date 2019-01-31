# Errors

Many operations in JSTP may end up with an error instead of a result. Following
the common Node.js convention, errors are always being passed as the first
argument of callbacks of these operations and if the operation was successful,
this argument will be null. This behavior is both consistent with the core
Node.js API and allows the JSTP API to be wrapped into promises easily and even
to be used with async/await, if you use these advanced features, while keeping
compatibility with plain callback-based asynchronous code for those who prefer
performance over convenience or those who are forced to use older versions of
Node.js.

Hanshakes, RPC invocations and introspection requests are special cases of such
operations. If they end up with an error, this error will be sent over
network. As you can see in
[handshake](../advanced/protocol.md#handshake-packet-handshake) and
[callback](../advanced/protocol.md#remote-call-response-packet-callback) packets
description, such errors are serialized into arrays that contain an error code
and an optional error description. A high-level abstraction for these arrays is
the [`RemoteError`][remoteerror] class.

Callbacks of the operations stated above will receive instances of `RemoteError`
as the first argument if an error occured. However, when returning an error
from a remote method, you can pass any of the following to a callback:

- `RemoteError` instance;
- `Error` instance;
- numeric error code;
- error message as a string;
- any other object that will return an error message as a result
  of its `toString` method.
- `Array` of 1 or 2 elements: `[code, message]`, where the `code` is a number
  and the optional `message` is a string.

If an error code is unknown (i.e., in any case except the first and third ones)
it will be set to zero. However, it is recommended to leverage error codes
even for custom errors and return them instead of `Error` instances as it is
more efficient to send numbers than strings.

If a method throws an exception, the calling side will receive
[ERR_INTERNAL_API_ERROR](#jstperr_internal_api_error).

## Predefined Error Codes

### jstp.ERR_APP_NOT_FOUND

Value: `10`.

Default message: `'Application not found'`.

### jstp.ERR_AUTH_FAILED

Value: `11`.

Default message: `'Authentication failed'`.

### jstp.ERR_INTERFACE_NOT_FOUND

Value: `12`.

Default message: `'Interface not found'`.

### jstp.ERR_INTERFACE_INCOMPATIBLE

Value: `13`.

Default message: `'Incompatible interface'`.

### jstp.ERR_METHOD_NOT_FOUND

Value: `14`.

Default message: `'Method not found'`.

### jstp.ERR_NOT_A_SERVER

Value: `15`.

Default message: `'Not a server'`.

### jstp.ERR_INTERNAL_API_ERROR

Value: `16`.

Default message: `'Internal API error'`.

## Class: jstp.RemoteError

This class extends `Error` and represents an error that has been
received from a remote method call over network.

### new RemoteError(code\[, message\])

- `code` [`<number>`][number] Error code.
- `message` [`<string>`][string] Error message.

If the `message` is not provided, it is set to either `code.toString()` or one
of the default messages if the `code` is one of the defined in this package
(listed above).

### error.code

- [`<number>`][number]

### error.message

- [`<string>`][string]

### error.toJstpArray()

- Returns: [`<Array>`][array]

Returns an array for JSTP packets. This array will always contain the error
code and, if the message is not equal to code and the code is not one of
predefined error codes, the error message.

### Class Method: RemoteError.fromJstpArray(array)

- `array` [`<Array>`][array] array from a JSTP packet.
- Returns: [`<RemoteError>`][remoteerror]

This factory method creates a `RemoteError` instance from an array found in a
JSTP packet.

### Class Method: RemoteError.getJstpArrayFor(error)

- `error` [`<RemoteError>`][remoteerror] |
  [`<Error>`][error] |
  [`<number>`][number] |
  [`<string>`][string] Error to be converted to an array for a JSTP packet.
- Returns: [`<Array>`][array]

This function returns an array suitable to be sent in a JSTP packet from a
`RemoteError` instance, an `Error` instance, an error code or an error message.
If there is no error code (i.e., an `Error` or a `String` is passed), the error
code is assumed to be `0`.

[remoteerror]: #class-jstpremoteerror
[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
