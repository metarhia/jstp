'use strict';

const semver = require('semver');

const apps = require('./applications');
const Connection = require('./connection');
const SimpleAuthPolicy = require('./simple-auth-policy');

const HANDSHAKE_TIMEOUT = 3000;

// Initializes JSTP server.
//   applications - applications array or index
//                  (see applications.createAppsIndex)
//   authPolicy - authentication policy is a function or an object with method
//                startSession (optional).
//                see jstp.SimpleAuthPolicy.
//   heartbeatInterval - heartbeat interval, if heartbeat should be used
//                       (optional).
//   listener - jstp connection listener that will be registered on
//              server 'connect' event (optional).
//
const initServer = function(
  applications, authPolicy, heartbeatInterval, listener
) {
  if (Array.isArray(applications)) {
    applications = apps.createAppsIndex(applications);
  }

  // versions cached for efficient search when provided version is a range
  this._cachedVersions = new Map();
  applications.forEach((appVersions, appName) => {
    const versions = Array.from(appVersions)
      .filter(version => version[0] !== 'latest')
      .map(version => [new semver.SemVer(version[0]), version[1]])
      .sort((a, b) => semver.rcompare(a[0], b[0]));
    this._cachedVersions.set(appName, versions);
  });

  if (typeof(authPolicy) === 'number') {
    heartbeatInterval = authPolicy;
    authPolicy = null;
  }

  this.applications = applications;
  this.heartbeatInterval = heartbeatInterval;

  if (typeof authPolicy === 'function') {
    this.startSession = authPolicy;
  } else {
    if (!authPolicy) authPolicy = new SimpleAuthPolicy();
    this.startSession = authPolicy.startSession.bind(authPolicy);
  }

  this.clients = {};
  this._cachedClientsArray = [];

  this.on('connect', this._onClientConnect.bind(this));
  this.on('disconnect', this._onClientDisconnect.bind(this));

  if (listener) this.on('connect', listener);
};

// JSTP server base class with necessary methods.
//
class Server {
  // Get all clients as an array of JSTP connection instances.
  //
  getClients() {
    if (this._cachedClientsArray.length === 0) {
      this._cachedClientsArray = Object.keys(this.clients)
        .map(cid => this.clients[cid]);
    }

    return this._cachedClientsArray;
  }

  // Handler of a new connection event emitter from the underlying server.
  //   socket - a lower-level socket or connection
  //
  _onRawConnection(socket) {
    const connection = new Connection(this.createTransport(socket), this);

    connection.on('error', (error) => {
      this.emit('connectionError', error, connection);
    });

    this.emit('connect', connection);

    connection.setTimeout(HANDSHAKE_TIMEOUT, () => {
      if (!connection.handshakeDone) {
        connection.close();
        this.emit('handshakeTimeout', connection);
      } else if (this.heartbeatInterval) {
        connection.startHeartbeat(this.heartbeatInterval);
      }
    });
  }

  _getApplication(name, version) {
    const appVersions = this.applications.get(name);
    if (!appVersions) return null;
    if (!version) return appVersions.get('latest');
    // when version is not a range simply return matched
    if (semver.valid(version)) return appVersions.get(version);

    // search matching version, first matched will be the latest
    try {
      const range = new semver.Range(version);
      const versions = this._cachedVersions.get(name);
      for (let i = 0; i < versions.length; i++) {
        // version === [versionCode, app]
        const version = versions[i];
        if (range.test(version[0])) return version[1];
      }
    } catch (error) {
      // ignored
    }
    return null;
  }

  // Client connection event handler.
  //   connection - JSTP connection instance
  //
  _onClientConnect(connection) {
    this.clients[connection.id] = connection;
    this._cachedClientsArray.push(connection);
  }

  // Client connection close event handler.
  //   connection - JSTP connection instance
  //
  _onClientDisconnect(connection) {
    delete this.clients[connection.id];
    this._cachedClientsArray = [];
  }
}

module.exports = {
  initServer,
  Server,
};
