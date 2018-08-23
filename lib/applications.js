'use strict';

const semver = require('semver');

const common = require('./common');
const errors = require('./errors');

// Generic application class. You are free to substitute it with whatever suits
// your needs.
//   name - application name that may contain version after '@'
//          (e.g. app@1.0.0). Version in name is preferred over
//          'version' parameter
//   api - object that contains interfaces as its fields each of which
//         contains functions by method names. Each method has the following
//         signature (connection, <0 or more method arguments>, callback)
//   eventHandlers - object that contains interfaces as its fields each
//                   of which contains functions by event names. Each method
//                   has the following signature
//                   (connection, <0 or more event arguments>)
//   version - application version of 'name' application (optional).
//             If a version is not provided either here or in `name`,
//             '1.0.0' will be used
//   sessionStorageProvider - provider for session storage (optional).
//                            If provided, it will be used to store sessions
//                            independently of other applications
//
class Application {
  constructor(name, api, eventHandlers = {}, version, sessionStorageProvider) {
    if (sessionStorageProvider === undefined && typeof version === 'object') {
      sessionStorageProvider = version;
      version = null;
    }
    [this.name, this.version] = common.rsplit(name, '@');
    const providedVersion = this.version || version;
    if (providedVersion && !semver.valid(providedVersion)) {
      throw new TypeError('Invalid semver version');
    }
    this.version = providedVersion || '1.0.0';
    this.api = api;
    this.eventHandlers = eventHandlers;
    this.sessionsStorage = sessionStorageProvider;
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
      callback(errors.ERR_INTERFACE_NOT_FOUND);
      return;
    }

    const method = appInterface[methodName];
    if (!method) {
      callback(errors.ERR_METHOD_NOT_FOUND);
      return;
    }

    if (method.length !== args.length + 2) {
      callback(errors.ERR_INVALID_SIGNATURE);
      return;
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

  // Handle incoming event
  //   connection - JSTP connection that received event
  //   interfaceName - name of the interface
  //   eventName - name of the event
  //   args - event arguments
  //
  handleEvent(connection, interfaceName, eventName, args) {
    const handlerInterface = this.eventHandlers[interfaceName];
    if (handlerInterface) {
      const handler = handlerInterface[eventName];
      if (handler) handler(connection, ...args);
    }
  }
}

// Create an index of applications from an array
//   applications - array of JSTP applications
//
const createAppsIndex = applications => {
  const index = new Map();

  applications.forEach(application => {
    let versions = index.get(application.name);
    if (!versions) {
      versions = new Map();
      index.set(application.name, versions);
    }

    if (versions.has(application.version)) {
      throw new Error(
        `Multiple instances of application: ${application.name} ` +
        `with version: ${application.version}`
      );
    }
    versions.set(application.version, application);

    const latest = versions.get('latest');
    if (!latest || semver.gt(application.version, latest.version)) {
      versions.set('latest', application);
    }
  });

  return index;
};

module.exports = {
  Application,
  createAppsIndex,
};
