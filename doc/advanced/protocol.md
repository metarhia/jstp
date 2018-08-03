# JavaScript Transfer Protocol

**WARNING: THIS DOCUMENT IS VASTLY OUTDATED AND MISLEADING.**

JSTP is a data transfer protocol that uses JavaScript objects syntax as the
encoding format and supports metadata. The protocol has 8 types of packets:

- `call` — remote API call;
- `callback` — remote API response;
- `event` — event with attached data;
- `state` — data synchronization;
- `stream` — data streaming;
- `handshake` — protocol handshake;
- `health` — system data about resource state and usage;
- `inspect` — API introspection request;
- this list is a subject to change.

```javascript
// Packet ID 17, remote call, interface auth, method newAccount
{call:[17,'auth'],newAccount:['Payload data']}

// Response to packet 17, operation is successful, record ID is 15703
{callback:[17],ok:[15703]}

// Event in packet 18, interface auth, event named insert
{event:[18,'auth'],insert:['Marcus Aurelius','AE127095']}
```

Packet structure:

- a packet is an object with several keys;

- the first one is a header, the name of this key is the packet type,
  its elements are:

  - `[0]` — unique number that identifies the packet inside the connection;
    packet with ID `0` is sent by a client (the side that initiated the
    connection) and the client increments it by `1` with each request;
    a server has a separate counter that is being decremented by `1` with
    each request or response to the client; if any of the sides sends a
    request (like `call` or `inspect`), another one responds with a
    `callback` packet with the same ID.

  - `[1]` — resource identifier:

    - in `call`, `event` and `inspect` — name of an interface;
    - in `state` — identifier of the mutating object;

- the second key is identifier:

  - in `call` — method name;

  - in `callback` - response status (`ok` or `error`);

  - in `event` — event name;

  - in `state` — method identifier (`inc`, `dec`, `delete`, `let`, `push`,
    `pop`, `shift`, `unshift`);

  - in `inspect` — no value;

  - in `stream` — no value.

## Remote Call Packet `call`

Example:

```javascript
{call:[3,'interfaceName'],methodName:['Payload data']}
```

## Remote Call Response Packet `callback`

Examples:

```javascript
{callback:[14],ok:[15703]}

{callback:[397],error:[4,'Data validation failed']}

{callback:[-23],ok:[]}
```

## Remote Event Packet `event`

Examples:

```javascript
{event:[-12,'chat'],message:['Marcus','Hello there!']}

{event:[51,'game'],vote:[5]}

{event:[-79,'db'],insert:['Marcus','Aurelius','Rome','AE127095']}
```

## Data Synchronization Packet `state`

Examples:

```javascript
{state:[-12,'object.path.prop1'],inc:5}
{state:[-13,'object.path.prop2'],dec:1}
{state:[-14,'object.path.prop3'],let:700}
{state:[-15,'object.path.prop4'],let:'Hello'}
{state:[-16,'object.path.prop5'],let:{f:55}}
{state:[-17,'object.path.prop5'],let:[1,2,7]}
{state:[-18,'object.path.prop6'],delete:0}
{state:[-19,'object.path.set1'],let:['A','D']}
{state:[-20,'object.path.set1'],push:'C'}
{state:[-20,'object.path.set2'],let:[5,6,9]}
{state:[-20,'object.path.set2'],push:12}
{state:[-20,'object.path.set2'],pop:2}
{state:[-20,'object.path.set2'],shift:3}
{state:[-20,'object.path.set2'],delete:5}
{state:[-20,'object.path.set2'],unshift:1}
```

## Data Stream Packet `stream`

Examples:

```javascript
{stream:[9],data:'Payload start...'}
{stream:[9],data:'...continue...'}
{stream:[9],data:'...end'}
```

## Handshake Packet `handshake`

Handshake packets always have ID equal to `0`. The response contains either
the key `ok` with a value that is the session identifier or `error` that is
an array with error code and optional error message.

The action field of handshake requests specifies the authentication strategy.
There are two supported strategies now:

- `login` — authentication with login and password. The payload is an array of
  two elements: username and password, both represented as strings.
- `anonymous` — anonymous session request. The payload is ignored (e.g., `true`
  or an empty array may be used). For anonymous handshakes the action field can
  be omitted completely, `anonymous` is implied by default.

More strategies may be added in the future (for example, `session` to reconnect
to an existing session after connection break due to a network error).

Successful handshake:

```javascript
C: {handshake:[0,'example'],login:['marcus','7b458e1a9dda....67cb7a3e']}
S: {handshake:[0],ok:'9b71d224bd62...bcdec043'}
```

In this excerpt `'example'` is the name of an application, `marcus`
is the user name and `9b71d224bd62...bcdec043` is the session id.

Successful anonymous handshake:

```javascript
C: {handshake:[0,'example']}
S: {handshake:[0],ok:'f3785d96d46a...def46f73'}
```

It may be necessary for registration or public service. Server responds
with a session ID.

Successful handshake of [Impress](https://github.com/metarhia/impress) worker
connecting to a private cloud controller:

```javascript
C: {handshake:[0,'impress'],login:['S1N5','d3ea3d73319b...5c2e5c3a']}
S: {handshake:[0],ok:'PrivateCloud'}
```

`PrivateCloud` is the name of a cloud and `d3ea3d73319b...5c2e5c3a` is the
cloud access key.

Application not found:

```javascript
C: {handshake:[0,'example'],marcus:'fbc2890caada...0c466347'}
S: {handshake:[0],error:[10,'Application not found']}
```

In this example `marcus` is username and `fbc2890caada...0c466347` is salted
`sha512` hash of a password.

Authentication error:

```javascript
C: {handshake:[0,'example'],marcus:'e2dff7251967...14b8c5da'}
S: {handshake:[0],error:[11,'Authentication failed']}
```

## Introspection Request Packet `inspect`

This packet is being sent for remote API introspection request and can be
initiated by either side.

Just like the `call` packet, the other side responds with a `callback` packet.

Example of a successful introspection retrieval:

```javascript
C: {inspect:[42,'interfaceName']}
S: {callback:[42],ok:['method1','method2']}
```

Error getting the introspection:

```javascript
C: {inspect:[15,'unknownInterface']}
S: {callback:[15],error:[12,'Interface not found']}
```

## Data Transmission and Packet Aggregation

### TCP

TCP protocol transfers a stream of data, so fragments sent sequentially are
glued and cut in any positions by the protocol. In order to split the stream
into separate messages we must either specify the length of each packet or
include message terminators. JSTP uses terminator that allows to accumulate
and split the buffer quite efficiently.

Each JSTP packet must end with a null character. When a TCP packet arrives,
each null character is replaced with a comma and the result is put into
the buffer (while the empty buffer always has the `[` character). As soon
as the received packet ends with a terminator, after character replacement
and putting the data into the buffer, the `]` character is placed into the
buffer and its whole content is parsed.

### WebSocket

Since the WebSocket API used in browsers doesn't expose the vanilla frame-based
or streaming API (though supported by WebSocket protocol) but only
message-based one which splits messages into frames and aggregates them back
together automatically, and all the major WebSocket implementations are capable
of that too, there's no need to build the same mechanism again on top of
WebSocket and induce unnecessary overhead because of situation that will never
happen.
