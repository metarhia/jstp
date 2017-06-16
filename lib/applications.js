'use strict';

const errors = require('./errors');

const apps = {};
module.exports = apps;

// Generic application class. You are free to substitute it with whatever suits
// your needs.
//   name - application name
//   api - application API
//
class Application {
  constructor(name, api) {
    this.name = name;
    this.api = api;
  }

  // Call application method
  //   connection - JSTP connection
  //   interfaceName - name of the interface
  //   methodName - name of the method
  //   args - method arguments
  //   callback - method callback
  //
  callMethod(connection, interfaceName, methodName, args, callback) {
    const appInterface = this.api[interfaceName];
    if (!appInterface) {
      return callback(errors.ERR_INTERFACE_NOT_FOUND);
    }

    const method = appInterface[methodName];
    if (!method) {
      return callback(errors.ERR_METHOD_NOT_FOUND);
    }

    if (method.length !== args.length + 2) {
      return callback(errors.ERR_INVALID_SIGNATURE);
    }

    method(connection, ...args, callback);
  }

  // Get an array of methods of an interface
  //   interfaceName - name of the interface to inspect
  //
  getMethods(interfaceName) {
    const appInterface = this.api[interfaceName];
    return appInterface && Object.keys(appInterface);
  }
}
apps.Application = Application;

// Create an index of applications from an array
//   applications - array of JSTP applications
//
apps.createAppsIndex = (applications) => {
  const index = {};

  applications.forEach((application) => {
    index[application.name] = application;
  });

  return index;
};
