# Transport

## Interface: Transport

Generic transport interface that is responsible for sending and receiving JSTP
messages over the network protocol. Implementations must guarantee that the
messages will be delivered in the same order in which they were sent.

### Event: 'message'

- `message` [`<Object>`][object] Parsed message.

### transport.send(data)

- `data` [`<string>`][string] | [`<Buffer>`][buffer] Serialized JSTP message.

Send data over the connection.

### transport.end(\[data\])

- `data` [`<string>`][string] | [`<Buffer>`][buffer] Serialized JSTP message.

End the connection optionally sending the last piece of data.

### transport.getRawTransport()

- Returns: [`<Object>`][object]

Returns underlying transport object.

[buffer]: https://nodejs.org/api/buffer.html#buffer_class_buffer
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
