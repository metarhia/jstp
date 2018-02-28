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
//   options - will be destructured and passed directly to connFactory.
//             The last argument of options is a callback
//             that will be called when connection is established
//
const newConnectFn = (
  connFactory, transportClass
) => (app, client, ...options) => {
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
      client.connectPolicy =
        client.connectPolicy.connect.bind(client.connectPolicy);
    }
    const connection = new Connection(transport, null, client);
    client.connectPolicy(
      app, connection, client.session,
      (error, connection, session) => {
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
const newConnectAndInspectFn = (connFactory, transportClass) => {
  const connect = newConnectFn(connFactory, transportClass);
  return (app, client, interfaces, ...options) => {
    const callback = common.extractCallback(options);
    connect(app, client, ...options, (error, connection) => {
      if (error) {
        callback(error);
        return;
      }
      const proxies = Object.create(null);
      let errored = false;
      const len = interfaces.length;
      let count = 0;
      interfaces.forEach((name) => {
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
  newConnectFn,
  newConnectAndInspectFn,
};
