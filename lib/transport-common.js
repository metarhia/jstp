'use strict';

const Connection = require('./connection');
const Application = require('./applications').Application;
const SimpleConnectPolicy = require('./simple-connect-policy');
const common = require('./common');

const DEFAULT_BACKOFF_TIME = 1000;
const MAX_BACKOFF_TIME = 32000;
const RANDOM_OFFSET_MAX = 1000;

function createDefaultReconnector() {
  let backoff = DEFAULT_BACKOFF_TIME;
  const randomMsecGen = () =>
    Math.floor((RANDOM_OFFSET_MAX + 1) * common.cryptoRandom());
  return (connection, reconnectFn) => {
    if (connection.closedIntentionally) return;
    setTimeout(() => {
      reconnectFn(error => {
        if (error) {
          const newBackoff = backoff * 2;
          backoff =
            newBackoff < MAX_BACKOFF_TIME ? newBackoff : MAX_BACKOFF_TIME;
          return;
        }
        backoff = DEFAULT_BACKOFF_TIME;
      });
    }, backoff + randomMsecGen());
  };
}

// Create a function to create a JSTP client with connFactory and
// transportFactory.
//   connFactory - function that will be called with ...options
//                 and must return rawConnection in callback in a form
//                 (error, rawConnection)
//   transportClass - class that will be instantiated with rawConnection
//
// returns function with arguments
//   app - string or object, application to connect to as 'name' or
//         'name@version' or { name, version }, where version
//         must be a valid semver range
//   client - optional client object with following properties:
//            * application - object, optional (see jstp.Application)
//            * connectPolicy - function or
//              object ('connect' function will be extracted as bound),
//              optional (see connect in jstp.SimpleConnectPolicy)
//            * heartbeatInterval - number, optional
//            * session - jstp.Session object, if provided, will try
//              to reconnect to the existing session (optional)
//            * reconnector - optional function with signature
//              `(connection, reconnectFn)`, that will be called after the
//              connection is closed and can be used to reconnect the connection
//              to the same or another server by calling reconnectFn inside it
//              providing options in the same way they are provided when
//              connecting to the server (to change the transport, its name
//              must be provided before the other options).
//              If omitted, default reconnector that provides exponential
//              backoff functionality will be used
//            * logger - optional EventEmitter object to use for logging.
//              If omitted, logging events are emitted on the connection
//              object itself
//   options - will be destructured and passed directly to connFactory.
//             The last argument of options is a callback
//             that will be called when connection is established
//
const newConnectFn = (connFactory, transportClass, transportName) => (
  app,
  client,
  ...options
) => {
  const callback = common.extractCallback(options);
  connFactory(...options, (error, rawConnection) => {
    if (error) {
      callback(error);
      return;
    }

    // eslint-disable-next-line new-cap
    const transport = new transportClass(rawConnection);
    if (!client) {
      client = {
        application: new Application('jstp', {}),
        connectPolicy: null,
      };
    } else if (!client.application) {
      client.application = new Application('jstp', {});
    }
    if (!client.connectPolicy) {
      client.connectPolicy = new SimpleConnectPolicy().connect;
    } else if (typeof client.connectPolicy === 'object') {
      client.connectPolicy = client.connectPolicy.connect.bind(
        client.connectPolicy
      );
    }
    if (!client.reconnector) {
      client.reconnector = createDefaultReconnector();
    }
    client._connectionOptions = options;
    client._connectionTransport = transportName;
    const connection = new Connection(transport, null, client);
    client.connectPolicy(
      app,
      connection,
      client.session,
      (error, connection, session) => {
        connection._serverApp = app;
        if (error) {
          callback(error, connection);
          return;
        }
        if (client.heartbeatInterval) {
          connection.startHeartbeat(client.heartbeatInterval);
        }
        callback(null, connection, session);
      }
    );
  });
};

// Same as newConnectFn but will also perform inspect of specified
// interfaces.
//   interfaces - array of interface names to perform inspect on
//
const newConnectAndInspectFn = (connFactory, transportClass, transportName) => {
  const connect = newConnectFn(connFactory, transportClass, transportName);
  return (app, client, interfaces, ...options) => {
    const callback = common.extractCallback(options);
    connect(
      app,
      client,
      ...options,
      (error, connection) => {
        if (error) {
          callback(error);
          return;
        }
        const proxies = Object.create(null);
        let errored = false;
        const len = interfaces.length;
        let count = 0;
        if (len === 0) {
          callback(null, connection, proxies);
          return;
        }
        interfaces.forEach(name => {
          connection.inspectInterface(name, (error, proxy) => {
            if (!errored) {
              count++;
              if (error) {
                errored = true;
                callback(error, connection);
                return;
              }
              proxies[name] = proxy;
              if (count === len) callback(null, connection, proxies);
            }
          });
        });
      }
    );
  };
};

// Create a function to reconnect a JSTP client with connFactory and
// transportFactory.
//   connFactory - function that will be called with ...options
//                 and must return rawConnection in callback in a form
//                 (error, rawConnection)
//   transportClass - class that will be instantiated with rawConnection
//
// returns function with arguments
//   connection - Connection object
//   options - will be destructured and passed directly to connFactory.
//             The last argument of options is a callback that will
//             be called when the connection is established
//
const newReconnectFn = (connFactory, transportClass) => (
  connection,
  ...options
) => {
  const callback = common.extractCallback(options);
  connFactory(...options, (error, rawConnection) => {
    if (error) {
      callback(error);
      return;
    }

    if (connection.transport) {
      connection._removeTransport();
    }
    // eslint-disable-next-line new-cap
    connection._initTransport(new transportClass(rawConnection));

    connection.client.connectPolicy(
      connection._serverApp,
      connection,
      connection.session,
      (error, connection) => {
        if (error) {
          callback(error, connection);
          return;
        }
        if (connection.client.heartbeatInterval) {
          connection.startHeartbeat(connection.client.heartbeatInterval);
        }
        callback(null, connection);
      }
    );
  });
};

// Utility method to create function to produce servers with
// serverFactory.
// If options is an array then wraps it as { applications: options }.
//
const newCreateServerFn = serverClass => (options, ...other) => {
  if (Array.isArray(options)) {
    options = { applications: options };
  }
  // eslint-disable-next-line new-cap
  return new serverClass(options, ...other);
};

module.exports = {
  newCreateServerFn,
  newConnectFn,
  newConnectAndInspectFn,
  newReconnectFn,
};
