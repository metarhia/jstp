'use strict';

const semver = require('semver');

const common = require('metarhia-common');

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
//   version - application version of 'name' application (optional)
//
class Application {
  constructor(name, api, eventHandlers = {}, version) {
    [this.name, this.version] = common.rsection(name, '@');
    if (!this.version) this.version = version;
    if (this.version && !semver.valid(this.version)) {
      throw new TypeError('Invalid semver version');
    }
    this.api = api;
    this.eventHandlers = eventHandlers;
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
const createAppsIndex = (applications) => {
  const latestApps = new Map();
  const index = new Map();

  applications.forEach((application) => {
    let appVersions = index.get(application.name);
    if (!appVersions) {
      appVersions = new Map();
      index.set(application.name, appVersions);
    }
    if (!application.version) {
      // no version means latest version
      if (appVersions.has('latest')) {
        throw new Error(
          `Multiple entries of '${application.name} without version`
        );
      } else {
        appVersions.set('latest', application);
      }
    } else {
      appVersions.set(application.version, application);

      // save latest version to fill missing latest versions later
      const latestApp = latestApps.get(application.name);
      if (!latestApp || semver.gt(application.version, latestApp.version)) {
        latestApps.set(application.name, application);
      }
    }
  });

  // set latest versions of apps without explicit latest version
  latestApps.forEach((application, appName) => {
    const appVersions = index.get(appName);
    if (!appVersions.has('latest')) {
      appVersions.set('latest', application);
    }
  });

  return index;
};

module.exports = {
  Application,
  createAppsIndex,
};
