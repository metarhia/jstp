'use strict';

const Connection = require('./connection');
const Application = require('./applications').Application;
const SimpleConnectPolicy = require('./simple-connect-policy');
const common = require('./common');

// Create a function to create a JSTP client with connFactory and
// transportFactory.
//   connFactory - function that will be called with ...options
//                 and must return rawConnection in callback in a form
//                 (error, rawConnection)
//   transportClass - class that will be instantiated with rawConnection
//
// returns function with arguments
//   appName - remote application name to connect to
//   client - optional client object with following properties:
//            * application - object, optional (see jstp.Application)
//            * connectPolicy - function or
//              object ('connect' function will be extracted as bound),
//              optional (see connect in jstp.SimpleConnectPolicy)
//            * heartbeatInterval - number, optional
//   options - will be destructured and passed directly to connFactory.
//             The last argument of options is optional callback
//             that will be called when connection is established
//
const newCreateConnectionFn = (
  connFactory, transportClass
) => (appName, client, ...options) => {
  const callback = common.extractCallback(options);
  connFactory(...options, (error, rawConnection) => {
    if (error) return callback(error);

    // eslint-disable-next-line new-cap
    const transport = new transportClass(rawConnection);
    if (!client) {
      client = {
        application: new Application('jstp', {}),
        connectPolicy: null
      };
    } else if (!client.application) {
      client.application = new Application('jstp', {});
    }
    if (!client.connectPolicy) {
      client.connectPolicy = new SimpleConnectPolicy().connect;
    } else if (typeof client.connectPolicy === 'object') {
      client.connectPolicy =
        client.connectPolicy.connect.bind(client.connectPolicy);
    }
    const connection = new Connection(transport, null, client);
    client.connectPolicy(appName, connection, (error, connection) => {
      if (error) return callback(error, connection);
      if (client.heartbeatInterval) {
        connection.startHeartbeat(client.heartbeatInterval);
      }
      callback(null, connection);
    });
  });
};

// Same as newCreateConnectionFn but will also perform inspect of specified
// interfaces.
//   interfaces - array of interface names to perform inspect on
//
const newCreateConnectionAndInspectFn = (connFactory, transportClass) => {
  const connect = newCreateConnectionFn(connFactory, transportClass);
  return (appName, client, interfaces, ...options) => {
    const callback = common.extractCallback(options);
    connect(appName, client, ...options, (error, connection) => {
      if (error) return callback(error);

      Promise.all(interfaces.map(name => new Promise((resolve, reject) => {
        connection.inspectInterface(name, (error, proxy) => {
          if (error) {
            reject(error);
          } else {
            resolve(proxy);
          }
        });
      }))).then((proxies) => {
        const api = proxies.reduce((acc, proxy, idx) => {
          const name = interfaces[idx];
          acc[name] = proxy;
          return acc;
        }, Object.create(null));
        callback(null, connection, api);
      }).catch((error) => {
        callback(error, connection);
      });
    });
  };
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
  newCreateConnectionFn,
  newCreateConnectionAndInspectFn
};
