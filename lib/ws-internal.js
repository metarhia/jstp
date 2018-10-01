'use strict';

const { EventEmitter } = require('events');

const mdsf = require('mdsf');
const websocket = require('websocket');
const WebSocketServer = websocket.server;
const WebSocketClient = websocket.client;

const constants = require('./internal-constants');
const common = require('./common');
const transport = require('./transport-common');

// WebSocket transport for JSTP.
//   connection - WebSocket connection
//
class Transport extends EventEmitter {
  constructor(connection) {
    super();

    this.connection = connection;

    this.connection.on('error', () => {
      this.connection.drop();
    });

    this.connection.on('message', message => {
      this._onMessage(message);
    });

    common.forwardMultipleEvents(this.connection, this, ['close', 'error']);
  }

  // returns underlying WebSocket connection.
  //
  getRawTransport() {
    return this.connection;
  }

  // Send data over the connection.
  //   data - Buffer or string
  //
  send(data) {
    if (Buffer.isBuffer(data)) {
      data = data.toString();
    }

    this.connection.sendUTF(data);
  }

  // End the connection optionally sending the last chunk of data.
  //   data - Buffer or string (optional)
  //
  end(data) {
    if (data) this.send(data);

    this.connection.close();
  }

  // WebSocket message handler.
  //   message - WebSocket message
  //
  _onMessage(message) {
    const data = (
      message.type === 'utf8' ? message.utf8Data : message.binaryData.toString()
    );

    let parsed;
    try {
      parsed = mdsf.parse(data);
    } catch (error) {
      this.emit('error', error);
      return;
    }

    this.emit('message', parsed);
  }
}

// Default originCheckStrategy value for WebSocket Server constructor.
//
const allowAllOriginCheckStrategy = function(/* origin */) {
  return true;
};

const initServer = function(options, httpServer) {
  options = Object.assign({}, options, {
    httpServer,
    autoAcceptConnections: false,
    maxReceivedFrameSize: constants.MAX_MESSAGE_SIZE,
    maxReceivedMessageSize: constants.MAX_MESSAGE_SIZE,
  });

  httpServer.isOriginAllowed =
    options.originCheckStrategy || allowAllOriginCheckStrategy;

  common.forwardEvent(httpServer, httpServer, 'clientError', 'error');

  httpServer.on('request', (request, response) => {
    response.writeHead(400);
    response.end();
  });

  httpServer.wsServer = new WebSocketServer(options);

  httpServer.wsServer.on('request', request => {
    if (
      !httpServer.isOriginAllowed(request.origin) ||
      !request.requestedProtocols.includes(constants.WEBSOCKET_PROTOCOL_NAME)
    ) {
      request.reject();
      return;
    }

    const connection = request.accept(
      constants.WEBSOCKET_PROTOCOL_NAME, request.origin
    );

    httpServer._onRawConnection(connection);
  });
};

// Create and connect WebSocketClient to get WebSocketConnection.
//   webSocketConfig - web socket client configuration, passed directly
//                     to WebSocketClient constructor
//   options - will be destructured and passed directly to
//             WebSocketClient.connect. The last argument of options
//             is optional callback that will be called when connection
//             is established.
//
const connectionFactory = (webSocketConfig, ...options) => {
  const callback = common.extractCallback(options);
  const wsClient = new WebSocketClient(webSocketConfig);
  options[1] = constants.WEBSOCKET_PROTOCOL_NAME;
  wsClient.once('connect', connection => {
    callback(null, connection);
  });
  wsClient.once('connectFailed', callback);
  wsClient.connect(...options);
};

const connect = transport.newConnectFn(connectionFactory, Transport, 'ws');

const connectAndInspect = transport.newConnectAndInspectFn(
  connectionFactory, Transport, 'ws'
);

const reconnect = transport.newReconnectFn(connectionFactory, Transport);

module.exports = {
  Transport,
  initServer,
  allowAllOriginCheckStrategy,
  // see transportCommon.newConnectFn
  //   webSocketConfig - web socket client configuration
  //                     (see connectionFactory)
  connect:
    (app, client, webSocketConfig, ...options) => connect(
      app, client, webSocketConfig, ...options
    ),
  // see transportCommon.newConnectAndInspectFn
  //   webSocketConfig - web socket client configuration
  //                     (see connectionFactory)
  connectAndInspect: (
    app, client, interfaces, webSocketConfig, ...options
  ) => connectAndInspect(
    app, client, interfaces, webSocketConfig, ...options
  ),
  // see transportCommon.newReconnectFn
  //   webSocketConfig - web socket client configuration
  //                     (see connectionFactory)
  reconnect:
    (connection, webSocketConfig, ...options) => reconnect(
      connection, webSocketConfig, ...options
    ),
};
